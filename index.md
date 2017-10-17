---
title       : Web Scraping con R
subtitle    : Introducción ó Scraping e boas prácticas
author      : J. Luis Juncal
date        : 2017-09-19
framework   : io2012        # {io2012, html5slides, shower, dzslides, ...}
highlighter : highlight.js  # {highlight.js, prettify, highlight}
hitheme     : tomorrow      # 
widgets     : []            # {mathjax, quiz, bootstrap}
mode        : selfcontained # {standalone, draft}
knit        : slidify::knit2slides
---.inicio

## Web Scraping con R
  
    
    
# Cómo obter datos da web





--- .segue bg:grey



## É complicado saber de todo -> Preguntade

--- .bases

## Motivacións

# Obter datos que non están dispoñibles  



        - De forma cómoda (CSV, fixed format,...)
        - Independencia de APIs externas
        - Non están pensados para ser procesados (webs do tempo, estado do tráfico, etc...)
        - Ter de primeira man os datos reais
        - Ter un histórico dos cambios nun dataset propio

---.bases

## Obxetivos  
  
  Exemplo: Obter un CSV dado polo cliente (plantilla de Prestashop) a partires de webs de lanas


### Fluxo de traballo

>- Necesidades -> Evaluación de alternativas -> Aplicación -> Retorno de experiencia

>- Ficheiro    -> Diversas linguaxes, frameworks, servicios -> Código -> Charla e documentación

--- .bases
## Servicios
  
  
Kimonolabs <http://www.kimonolabs.com/>  
import.io <https://www.import.io/standard-plans/>


--- .bases

## Linguaxes e frameworks dispoñibles  

 >-  Python 
 + Beautiful Soup
 >-  R  
 + Rvest (xml2, Httr)
 + RSelenium
  
            

         
        

--- .bases

## DOM



 ![DOM](./assets/img/DOM.gif)



<div class='source'>
  Fonte: <a href='http://librosweb.es/libro/ajax/capitulo_4.html'>Introduccion a DOM - Maestros del web</a>
</div>

--- .explicacion
## CSS Selectors 

É o xeito máis sinxelo e practico para acceder ós elementos do DOM que queremos utilizar

<div class='source'>
  Fonte: <a href='http://librosweb.es/libro/ajax/capitulo_4.html'>Introduccion a DOM - Maestros del web</a>
</div>


--- .explicacion
## Chrome Selector Gadget

--- .código

