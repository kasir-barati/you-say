terraform {
  required_version = ">= 1.4.2, <= 1.5.7"
}

module "fusionauth" {
  source                                  = "./fusionauth"
  deployment                              = var.deployment
  fusionauth_host                         = var.fusionauth_host
  fusionauth_issuer                       = var.fusionauth_issuer
  fusionauth_api_key                      = var.fusionauth_api_key
  fusionauth_tenant_id                    = var.fusionauth_tenant_id
  fusionauth_application_id               = var.fusionauth_application_id
  fusionauth_admin_group_id               = var.fusionauth_admin_group_id
  fusionauth_email_security               = var.fusionauth_email_security
  oauth_configuration_client_secret       = var.oauth_configuration_client_secret
  fusionauth_default_application_name     = var.fusionauth_default_application_name
  fusionauth_email_configuration_host     = var.fusionauth_email_configuration_host
  fusionauth_email_configuration_port     = var.fusionauth_email_configuration_port
  fusionauth_email_configuration_username = var.fusionauth_email_configuration_username
  fusionauth_email_configuration_password = var.fusionauth_email_configuration_password
}
