---
title: "R Notebook"
output: html_notebook
---

This is an [R Markdown](http://rmarkdown.rstudio.com) Notebook. When you execute code within the notebook, the results appear beneath the code. 

Try executing this chunk by clicking the *Run* button within the chunk or by placing your cursor inside it and pressing *Ctrl+Shift+Enter*. 


```
## 
## Attaching package: 'dplyr'
```

```
## The following objects are masked from 'package:stats':
## 
##     filter, lag
```

```
## The following objects are masked from 'package:base':
## 
##     intersect, setdiff, setequal, union
```

```
## Loading required package: xml2
```

```
## 
## Attaching package: 'readr'
```

```
## The following object is masked from 'package:rvest':
## 
##     guess_encoding
```

Add a new chunk by clicking the *Insert Chunk* button on the toolbar or by pressing *Ctrl+Alt+I*.

When you save the notebook, an HTML file containing the code and output will be saved alongside it (click the *Preview* button or press *Ctrl+Shift+K* to preview the HTML file).
Scrape katia using ##rvest## utilities


```r
# Procesado da páxina principal, é distinta ás páxinas onde estará a información. 
# Poderiamos coller o campo prezo aquí, máis por sinxeleza e seguridade farémolo todo na mesma función

url<-read_html("http://www.katia.com/ES/lanas.html")
lanas<-url%>% 
        html_nodes("#principal .txt_normal .txt_normal")%>%
        html_text()

url%>%html_nodes('#principal .txt_normal .txt_normal')%>%
        html_attr("href")->enlaces_lanas
##crear data.table temporal
tabla_enlaces<-data.table(lanas,enlaces_lanas)
```

```
## Error in eval(expr, envir, enclos): no se pudo encontrar la función "data.table"
```

```r
head(tabla_enlaces)
```

```
## Error in head(tabla_enlaces): objeto 'tabla_enlaces' no encontrado
```
