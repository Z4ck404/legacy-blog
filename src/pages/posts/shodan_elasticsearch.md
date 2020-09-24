---
title: How hackers can find your exposed Elasticsearch clusters using Shodan!
subtitle: Your guide to ELK attacks and security
excerpt: >-
  For the last couple of months, I have been exploring Elasticsearch and I even
  shared some articles about it talking about how impressive the technology
  behind it is and how it can be used with other projects such as Spark to
  expand the search capabilities Elasticsearch offers with the real-time
  distributed analytics and machine learning Spark offers. 
date: '2020-06-25'
thumb_img_path: images/elasticsearch_finder.png
template: post
content_img_path: images/06-elasticsearch.png
---
### Exposed Elasticsearch cluster !

For the last couple of months, I have been exploring Elasticsearch and I even shared some articles about it talking about how impressive the technology behind it is and how it can be used with other projects such as Spark to expand the search capabilities Elasticsearch offers with the real-time distributed analytics and machine learning Spark offers. According to a blog post from 2017 by elastic, the ELK (Elasticsearch, Log-stash and Kibana) Stack has exceeded 100 million downloads (Knowing that in early 2017 the stack wasn’t as mature as it is now with all the ecosystem that grew around it to expand it’s capabilities and make it even more attractive).

***
Elasticsearch as I explained in details in this article is a highly scalable open-source full-text and analytics engine, built on the top of Lucene. Elasticsearch can be very helpful to add search to blogs or documents, in addition to it’s capabilities to analyze logs in real time and make it possible to perform very advanced analytics and even machine learning on these logs in order to monitor IT infrastructure or to detect threats in infrastructures. But most of the time lot of developers and DevOps engineers use it without any security layers, what makes it an attack vector for attackers to understand the internal architecture of these companies or organizations through the logs and find IPs and all the valuable information these logs can contain, or even sensitive data some companies store and index with Elasticsearch.

A search over Shodan for Elasticsearch clusters will tell you that there are thousands of Elasticsearch instances running and available with their remote APIs publicly exposed a along with other information such as the indices and all the meta data Elasticsearch endpoints provides (number of nodes, shards, plugins,etc).


<img src="/images/shodan.png">


And as you can see Shodan can help you filter the results based on country, organization or even keywords such as indices names or fields. But checking all the 34k results manually can be very time consuming and boring, and thanks to Shodan’s API this can be automated with a script to check all these IPs one by one, ping them and search their content for the specific thing you need for purposes of bug bounty for example. The script named ES-finder (Elasticsearch finder) created by our Cybersecurity Lab (Excelerate Systems France) is able to look for open instances of Elasticsearch obviously (But not only on port 9200 as the default), check their sizes, indices and see if Kibana is installed as well or not (it’s very helpful to explore the data in the cluster and it can also be linked to a front-end).


<img src="/images/elasticsearch_finder.png">


Then you can easily investigate in the clusters a little more, using curl and Elasticsearch endpoints.

```
curl -X GET http://<host name or ip>:9200/_cluster/indices #stats

```

<img src="/images/es_finder_rsl.png">


Once the cluster is found and exposed, the attacker can download and clone cluster’s data and expose it if it contains sensitive data as we hear in the news very often lately .


- [Amazon Elasticsearch Exposure](https://news.sophos.com/en-us/2019/11/15/exposed-amazon-elasticsearch-exposure/)
- [An Elasticsearch cluster 1.2 Billion people data exposed](https://www.cisomag.com/elasticsearch-server-exposed-1-2-billion-people-data/).
- [250 Million Microsoft Records exposed](https://thedefenceworks.com/blog/250-million-microsoft-records-exposed-in-another-elasticsearch-server-related-breach/).

### Securing you Elasticsearch cluster is FREE, never leave your cluster and data exposed ! 


<img src="/images/searchguard.jpeg">



Using a firewall to protect access to Elasticsearch is not always possible and even if it is, many experts still don’t recommend relaying on a firewall alone because the data is still not protected nor encrypted :In order to have a secure cluster, communication and data has to be encrypted.

During a couple years (since 2010) there was no security layer for Elasticsearch, until the very first plugin named “Elasticsearch Security Plugin” by Hendrik Saly, in October 2013.

Lately, Elastic B.V, the company that sprung from the Open Source Elasticsearch project released a commercial solution named X-Pack (2016) to add a security layer and some other features to Elasticsearch. As you may know, other solutions existed before (and still do) and offer free and commercial security for Elasticsearch, let’s have a closer look :


<img src="/images/timeline_searchguard.png">



**X-Pack** is a commercial solution by Elastic B.V. Since 2019, starting with versions 6.8.x and 7.1.x, parts of the security features of X-pack are available installed by default (note that the code is under the Elastic basic license and not under Apache 2.0 license) and free of charge.


<img src="/images/xpack.png">


**[SearchGuard](https://search-guard.com/)**,by Floragunn GmbH, is the first security solution that exists originally for Elasticsearch. A great advantage is that, since the first version, the whole offer is under the Apache license, so the free Community features aswell as Enterprise / Compliance features are entirely open source and open code. It also provides alerting features along with security in the free edition.

The fact that the code of a software is opened since the very first version is important when it comes to security. So we note that [each version of Search Guard is scanned and audited by Veracode for vulnerabilities and issues](https://search-guard.com/search-guard-ca-veracode-verified/). Also, SearchGuard can be installed as an additional plugin on Elasticsearch and Kibana for all the versions V5.x.x, V6.x.x and V7.x.x. (Previous version are available as well but may not be supported any more as explained by Search Guard team [here](https://docs.search-guard.com/latest/eol-policy)).

Now that I’ve presented different solutions and options to ensure encryption and manage credentials. Just make sure you don’t leave your cluster exposed no matter what tool you use.

> NEVER leave your cluster and data exposed !