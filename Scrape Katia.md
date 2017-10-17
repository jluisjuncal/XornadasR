---
title: "Scrape Katia"
output: html_notebook
---

This is an [R Markdown](http://rmarkdown.rstudio.com) Notebook. 
When you execute code within the notebook, the results appear beneath the code. 

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

Ler o ficheiro a rechear 


```r
listado_de_productos_prestashop <- read_delim("~/XornadasR/listado de productos prestashop.csv", ";", escape_double = FALSE, trim_ws = TRUE)
```

```
## Parsed with column specification:
## cols(
##   .default = col_character(),
##   `Product ID` = col_integer(),
##   `Active (0/1)` = col_integer(),
##   `Price tax included` = col_integer(),
##   `Tax rules ID` = col_integer(),
##   `Wholesale price` = col_integer(),
##   `On sale (0/1)` = col_integer(),
##   `Discount amount` = col_integer(),
##   `Discount percent` = col_double(),
##   `Discount from (yyyy-mm-dd)` = col_date(format = ""),
##   `Discount to (yyyy-mm-dd)` = col_date(format = ""),
##   EAN13 = col_double(),
##   Ecotax = col_integer(),
##   Width = col_double(),
##   Height = col_double(),
##   Depth = col_double(),
##   Weight = col_double(),
##   Quantity = col_integer(),
##   `Minimal quantity` = col_integer(),
##   `Additional shipping cost` = col_integer(),
##   `Available for order (0 = No, 1 = Yes)` = col_integer()
##   # ... with 13 more columns
## )
```

```
## See spec(...) for full column specifications.
```

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
Next, we have to iterate over the table, and scrape the links in it.

```r
scrape_katia <- function(url_to_scrape) {
        scraped_url <- read_html(url_to_scrape)
        #Codigo de precio funcional
        precio <- scraped_url %>%
        html_nodes("#principal b") %>% html_text()
       # View(precio)
        #fotos<-scraped_url%>%html_nodes("#img_01")%>%html_attr("href")
        ##foto_lana_grande<-scraped_url%>%html_nodes(".zoomWindow")
}

lapply(tabla_enlaces$enlaces_lanas[2:5],scrape_katia)
```

```
## Error in lapply(tabla_enlaces$enlaces_lanas[2:5], scrape_katia): objeto 'tabla_enlaces' no encontrado
```
