data "httpclient_request" "get-default-tenant" {
  request_method = "GET"
  depends_on     = [fusionauth_tenant.you-say-tenant]
  url            = "${var.fusionauth_host}/api/tenant/search?name=Default"
  request_headers = {
    "Accept"        = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
}

data "httpclient_request" "get-default-application" {
  request_method = "GET"
  depends_on     = [fusionauth_application.you-say-application]
  url            = "${var.fusionauth_host}/api/application/search?name=${var.fusionauth_default_application_name}"
  request_headers = {
    "Accept"        = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
}

locals {
  api_url                           = var.deployment == "production" ? "https://api.you-say.com" : "http://localhost:3001"
  frontend_app_url                  = var.deployment == "production" ? "https://you-say.com" : "http://localhost:3000"
  fusionauth_default_tenant_id      = jsondecode(data.httpclient_request.get-default-tenant.response_body).tenants[0].id
  fusionauth_default_tenant_name    = jsondecode(data.httpclient_request.get-default-tenant.response_body).tenants[0].name
  fusionauth_default_application_id = jsondecode(data.httpclient_request.get-default-application.response_body).applications[0].id
}
