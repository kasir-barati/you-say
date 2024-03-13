terraform {
  required_providers {
    fusionauth = {
      source  = "FusionAuth/fusionauth"
      version = "0.1.101"
    }
    httpclient = {
      version = "0.0.3"
      source  = "dmachard/http-client"
    }
  }
}
