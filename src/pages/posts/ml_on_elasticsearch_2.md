---
title: Machine learning on Elastic Search using Apache Spark and ES-Hadoop — Part 2 (Security Setup)
subtitle: The complete guide to secure the elasticstack and it's ecosystem using SearchGuard
excerpt: >-
  In the previous article (Part1), we installed the ELK stack along with the ES-Hadoop connector and spark, then we did some visualizations in Kibana with the houses price prediction data set from kaggle. In this part we will start with adding Search Guard to the stack in order to define permissions and access to our data and configurations, then we will implement our models with the help of Spark Ml lib, and we will finish with deploying our models in a pipeline in order to predict the prices for new entries to our Elasticsearch.
date: '2020-05-31'
thumb_img_path: images/sg_sparta.jpeg
template: post
content_img_path: images/sg_sparta.jpeg
---

In the previous article (Part1), we installed the ELK stack along with the ES-Hadoop connector and spark, then we did some visualizations in Kibana with the houses price prediction data set from kaggle.

In this part we will start with adding Search Guard to the stack in order to define permissions and access to our data and configurations, then we will implement our models with the help of Spark Ml lib, and we will finish with deploying our models in a pipeline in order to predict the prices for new entries to our Elasticsearch.

- Search Guard 

<img src="/images/searchguard.jpeg" alt="search-guard" />

I already talked about it in the part 1 of this series. Search Guard is an open source plugin for alerting and security for the elastic stack that comes with advanced security options to allow better integration in the various infrastructures that can be used with Elasticsearch. It adds security and encryption to Elasticsearch data and to communication both at the Transport and REST levels. Search Guard provides also a plugin for Kibana that adds a Search Guard GUI for security configuration (adding users, roles and performing roles mappings), and Signals configuration for alerting and monitoring watches

### 1 - Adding Search Guard to Elasticsearch :

Search Guard can be installed like any other Elasticsearch plugin by using the `bin/elasticsearch-plugin` command that ealsticsearch provides.
First we download the SG version matching our elasticsearch version :

<img src="/images/sg_version.png" alt="search-guard" />

then `cd` to elasticsearch dir and type :

```
bin/elasticsearch-plugin install -b file:///path/to/search-guard<version>.zip 
```
It is also possible to install the plugin directly from SG releases server by specifying the URL like this:

```
bin/elasticsearch-plugin install https://releases.floragunn.com/search-guard-7/<version>/search-guard-<version>.zip
```

When the plugin is successfully downloaded and installed, we can either execute the demo installer that search guard comes with for demo purposes and easy PoC configuration by :

```
cd <Elasticsearch directory>/plugins/search-guard-7/tools
chmod +x install_demo_configuration.sh && ./install_demo_configuration.sh
```

That will do the TLS setup by adding the demo TLS certificates to the config folder and adding the required configuration to elasticsearch.yml. It will also generate a `sgadmin_demo.sh` script that you can use for applying configuration changes on the command line.

> **NB** : Any changes in the configuration files of Search Guard (sg_*.yml) will require executing sg_admin for these changes to take place (adding a user,role,etc.).

But for production it’s recommended to do a manual installation by using your own certificates (in case you already have them or use Search Guard TLS offline generator that you can find in tools folder ).

### 2 - Adding Search Guard to Kibana:

The Search Guard Kibana plugin adds authentication, multi tenancy and the Search Guard configuration GUI to Kibana. Installing it is pretty much easy using the kibana-plugin command. We download the kibana plugin matching our version of kibana, we cd to the kibana directory and we type :

```
bin/kibana-plugin install file://path/to/kibana-plugin.zip
```
> **NB**: You can also download the zip files and unzip them in the right folders for both elasticsearch and kibana (/plugins) !

once search guard is added and configured successfully, [adding users, roles and defining security policies can be done using the sg_*.yml files with the help of sg_admin](https://docs.search-guard.com/latest/first-steps-user-configuration) or by using the kibana GUI.

<img src="/images/sg_gui.png" alt="search-guard" />

Let’s add a demo_user for this tutorial that we will use later to read data using es-hadoop :

```
**username** : demo_user
**password**: pass
```
<img src="/images/sg_add_user.png" alt="search-guard" />

> **NB** : In case you couldn’t see the Search Guard icon in Kibana please refer to [this page to solve the issue](https://docs.search-guard.com/latest/configuration-gui#access-control).

### 3 - Configuring ES-Hadoop with SG:

ES-hadoop as I mentioned in the part 1 is a sort of bridge that connects Elasticsearch with the Hadoop ecosystem so that they can benefit each other with distributed computing, distributed storage, distributed search and analytics and of course visualizations and real time dashboards.

<img src="/images/sg_diag.png" alt="search-guard" />

Elasticsearch-Hadoop is REST based which means it uses Elasticsearch REST interface for communication with Elasticsearch cluster, For that we won’t need any complicated configuration for spark in order to communicate with our secured es cluster.

First, let’s download es-Hadoop matching our Elasticsearch version (for this article I am using Elasticsearch 7.6.2) :

```
wget https://www.elastic.co/downloads/past-releases/elasticsearch-apache-hadoop-7-6-2
unzip elasticsearch-hadoop-7.6.2.zip
```
The spark Jar we need is located in the dist folder :

```
<pwd>/elasticsearch-hadoop-7.6.2/dist/elasticsearch-spark-20_2.11–7.6.2.jar
```
Next, we will need to add some configuration to Spark :

```
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.elasticsearch.spark._
import org.apache.spark.SparkConf
val conf = new SparkConf().setAppName("medium_tutorial")
conf.set("es.nodes.wan.only", "true")
conf.set("es.nodes.discovery", "false")
conf.set("es.nodes", "localhost") //localhost by default 
conf.set("es.port", "9200") //9200 by default// security configuration :
//authentication with a user name and password :
conf.set("es.net.http.auth.user", "demo_user") //username
conf.set("es.net.http.auth.pass", "pass") //password//SSL TLS congfiguration in case you use them//conf.set("es.net.ssl", "true")
//conf.set("es.net.ssl.cert.allow.self.signed","true")
//conf.set("es.net.ssl.keystore.location", "file://kirk-keystore.jks")
//conf.set("es.net.ssl.truststore.location", "file:///opt/spark/eshadoop/truststore.jks")val RDD = sc.esRDD("houses")RDD.count()
```

Save this configuration as a scala file (in this example spark_conf.scala) to execute it once or type the lines interactively is spark-shell.

Since we are using just HTTP Basic Auth with SG, all we need to setup is the user and password, but if you have other authentication/authorization mechanisms like client certificates, kerberos or whatever check the es-hadoop [documentation](https://www.elastic.co/guide/en/elasticsearch/hadoop/7.x/security.html) for the instructions.

We will read thehousesindex in our elasticsearch to a Spark RDD and run the `RDD.count()` command to count the number of documents loaded :

```
spark-shell -i spark_conf.scala --jars /elasticsearch-hadoop-7.6.2/dist/elasticsearch-spark-20_2.11–7.6.2.jar/elasticsearch-spark-20_2.11-7.6.2.jar
```
<img src="/images/spark2.png" alt="search-guard" />

> Search Guard is a trademark of floragunn GmbH, registered in the U.S. and in other countries. Elasticsearch, Kibana, Logstash, and Beats are trademarks of Elasticsearch BV, registered in the U.S. and in other countries. Apache, Apache Lucene, Apache Hadoop, Hadoop, Spark, Kafka, HDFS and the yellow elephant logo are trademarks of the Apache Software Foundation in the United States and/or other countries. Open Distro for Elasticsearch is licensed under Apache 2.0. All other trademark holders rights are reserved
