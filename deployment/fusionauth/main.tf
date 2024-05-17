provider "fusionauth" {
  host    = var.fusionauth_host
  api_key = var.fusionauth_api_key
}

resource "fusionauth_tenant" "you-say-tenant" {
  name      = "you-say-tenant"
  issuer    = var.fusionauth_issuer
  theme_id  = fusionauth_theme.custom-theme.id
  tenant_id = var.fusionauth_tenant_id

  login_configuration {
    require_authentication = true
  }
  multi_factor_configuration {
    login_policy = "Disabled"
  }
  email_configuration {
    security                         = var.fusionauth_email_security
    host                             = var.fusionauth_email_configuration_host
    port                             = var.fusionauth_email_configuration_port
    username                         = var.fusionauth_email_configuration_username
    password                         = var.fusionauth_email_configuration_password
    set_password_email_template_id   = fusionauth_email.setup-password-email-template.id
    email_verified_email_template_id = fusionauth_email.email-verification-template.id
    # implicit_email_verification_allowed = true
  }
  jwt_configuration {
    id_token_key_id                                    = fusionauth_key.id-token-key.id
    access_token_key_id                                = fusionauth_key.access-token-key.id
    time_to_live_in_seconds                            = 3600
    refresh_token_time_to_live_in_minutes              = 43200
    refresh_token_revocation_policy_on_password_change = true
  }
  external_identifier_configuration {
    change_password_id_time_to_live_in_seconds     = 600
    authorization_grant_id_time_to_live_in_seconds = 30
    change_password_id_generator {
      length = 32
      type   = "randomBytes"
    }

    device_code_time_to_live_in_seconds = 1000
    device_user_code_id_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    email_verification_id_time_to_live_in_seconds = 600
    email_verification_id_generator {
      length = 32
      type   = "randomBytes"
    }
    email_verification_one_time_code_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    setup_password_id_time_to_live_in_seconds = 86400
    setup_password_id_generator {
      length = 32
      type   = "randomBytes"
    }

    passwordless_login_time_to_live_in_seconds = 600
    passwordless_login_generator {
      length = 32
      type   = "randomBytes"
    }

    two_factor_id_time_to_live_in_seconds       = 300
    two_factor_trust_id_time_to_live_in_seconds = 2592000
    two_factor_one_time_code_id_generator {
      length = 6
      type   = "randomDigits"
    }

    registration_verification_id_time_to_live_in_seconds = 86400
    registration_verification_id_generator {
      length = 32
      type   = "randomBytes"
    }
    registration_verification_one_time_code_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    one_time_password_time_to_live_in_seconds          = 60
    external_authentication_id_time_to_live_in_seconds = 300
  }
  password_validation_rules {
    min_length        = 8
    validate_on_login = true
    remember_previous_passwords {
      count   = 1
      enabled = true
    }
  }
}

resource "fusionauth_application" "you-say-application" {
  name           = "you-say-application"
  tenant_id      = fusionauth_tenant.you-say-tenant.id
  application_id = var.fusionauth_application_id

  oauth_configuration {
    generate_refresh_tokens            = true
    require_registration               = true
    client_authentication_policy       = "NotRequired"
    proof_key_for_code_exchange_policy = "NotRequired"
    logout_url                         = "${local.api_url}/auth/login"
    client_secret                      = var.oauth_configuration_client_secret
    enabled_grants                     = ["authorization_code", "refresh_token", "password"]
    authorized_redirect_urls = [
      "${local.frontend_app_url}",
      "${local.api_url}/auth/login",
      "${local.api_url}/auth/oauth-callback",
    ]
  }
  lambda_configuration {
    id_token_populate_id     = fusionauth_lambda.id-token-populate-lambda-function.id
    access_token_populate_id = fusionauth_lambda.access-token-populate-lambda-function.id
  }
}

#region User roles and group
resource "fusionauth_application_role" "PostReader-role" {
  name           = "PostReader"
  description    = "A user with this role can read posts"
  application_id = fusionauth_application.you-say-application.id
  is_default     = false
  is_super_role  = false
}

resource "fusionauth_application_role" "PostCreator-role" {
  name           = "PostCreator"
  description    = "A user with this role can create posts"
  application_id = fusionauth_application.you-say-application.id
  is_default     = false
  is_super_role  = false
}

resource "fusionauth_application_role" "FileUploader-role" {
  name           = "FileUploader"
  description    = "A user with this role can upload files"
  application_id = fusionauth_application.you-say-application.id
  is_default     = false
  is_super_role  = false
}

resource "fusionauth_group" "admin-group" {
  name      = "admin-group"
  tenant_id = fusionauth_tenant.you-say-tenant.id
  group_id  = var.fusionauth_admin_group_id
  role_ids = [
    fusionauth_application_role.PostReader-role.id,
    fusionauth_application_role.PostCreator-role.id,
    fusionauth_application_role.FileUploader-role.id
  ]
}
#endregion

#region JWT
resource "fusionauth_key" "access-token-key" {
  length    = 4096
  algorithm = "RS256"
  name      = "key-for-access-token-key"
}

resource "fusionauth_key" "id-token-key" {
  algorithm = "RS256"
  name      = "key-for-id-token-key"
  length    = 4096
}

resource "fusionauth_lambda" "access-token-populate-lambda-function" {
  type = "JWTPopulate"
  name = "access-token-populate-lambda-function"
  body = file("${path.module}/lambda-functions/access-token.js")
}

resource "fusionauth_lambda" "id-token-populate-lambda-function" {
  type = "JWTPopulate"
  name = "id-token-populate-lambda-function"
  body = file("${path.module}/lambda-functions/id-token.js")
}
#endregion

#region Theme and templates
resource "fusionauth_theme" "custom-theme" {
  name              = "Custom Theme"
  source_theme_id   = "75a068fd-e94b-451a-9aeb-3ddb9a3b5987"
  stylesheet        = file("${path.module}/stylesheet.css")
  index             = file("${path.module}/templates/index.ftl")
  oauth2_authorize  = file("${path.module}/templates/login.ftl")
  helpers           = file("${path.module}/templates/helpers.ftl")
  default_messages  = "${file("${path.module}/templates/messages.ftl")}\nfrontend-app-url=${local.frontend_app_url}"
  password_complete = file("${path.module}/templates/change-password-complete.ftl")
}

#region Email templates
resource "fusionauth_email" "setup-password-email-template" {
  name                  = "Setup password email template"
  from_email            = "email@email.com"
  default_subject       = "Setup password"
  default_from_name     = "test@test.com"
  default_html_template = file("${path.module}/templates/email/set-password.html.ftl")
  default_text_template = file("${path.module}/templates/email/set-password.txt.ftl")
}
resource "fusionauth_email" "email-verification-template" {
  name                  = "Email verification template"
  from_email            = "email@email.com"
  default_subject       = "Verify your email"
  default_from_name     = "test@test.com"
  default_html_template = file("${path.module}/templates/email/email-verification.html.ftl")
  default_text_template = file("${path.module}/templates/email/email-verification.txt.ftl")
}
#endregion

data "httpclient_request" "set-you-say-tenant-theme" {
  request_method = "PATCH"
  url            = "${var.fusionauth_host}/api/tenant/${fusionauth_tenant.you-say-tenant.id}"
  depends_on     = [fusionauth_theme.custom-theme, data.httpclient_request.get-default-tenant]
  request_headers = {
    "Accept"        = "application/json"
    "Content-Type"  = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
  request_body = jsonencode(
    {
      "tenant" : {
        "name" : "${fusionauth_tenant.you-say-tenant.id}",
        "themeId" : "${fusionauth_theme.custom-theme.id}"
      }
    }
  )
}

data "httpclient_request" "set-default-tenant-theme" {
  request_method = "PATCH"
  url            = "${var.fusionauth_host}/api/tenant/${local.fusionauth_default_tenant_id}"
  depends_on     = [fusionauth_theme.custom-theme, data.httpclient_request.get-default-tenant]
  request_headers = {
    "Accept"        = "application/json"
    "Content-Type"  = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
  request_body = jsonencode(
    {
      "tenant" : {
        "name" : "${local.fusionauth_default_tenant_name}",
        "themeId" : "${fusionauth_theme.custom-theme.id}"
      }
    }
  )
}
#endregion

#region preregistered users
resource "fusionauth_user" "you-say-admin-user" {
  tenant_id  = fusionauth_tenant.you-say-tenant.id
  email      = "admin@you-say.com"
  username   = "admin"
  first_name = "Admin"
  last_name  = "Admin"
  password   = "adminadmin"
  # data       = jsonencode({})
}

resource "fusionauth_registration" "you-say-admin-registration" {
  user_id        = fusionauth_user.you-say-admin-user.user_id
  application_id = fusionauth_application.you-say-application.id
}

resource "fusionauth_user" "you-say-temp-user" {
  tenant_id                = fusionauth_tenant.you-say-tenant.id
  email                    = "souma.kazuya@you-say.com"
  username                 = "souma_kazuya"
  first_name               = "Souma"
  last_name                = "Kazuya"
  password                 = "souma.kazuya"
  skip_verification        = true
  password_change_required = false
  # data       = jsonencode({})
}

resource "fusionauth_registration" "you-say-temp-user-registration" {
  user_id        = fusionauth_user.you-say-temp-user.user_id
  application_id = fusionauth_application.you-say-application.id
}

data "httpclient_request" "create-super-admin-user" {
  url            = "${var.fusionauth_host}/api/user/registration"
  depends_on     = [fusionauth_theme.custom-theme, data.httpclient_request.get-default-application]
  request_method = "POST"
  request_headers = {
    "Accept"                = "application/json"
    "Content-Type"          = "application/json"
    "Authorization"         = "${var.fusionauth_api_key}"
    "X-FusionAuth-TenantId" = "${local.fusionauth_default_tenant_id}"
  }
  request_body = jsonencode(
    {
      "skipRegistrationVerification" : true,
      "skipVerification" : true,
      "registration" : {
        "roles" : ["admin"],
        "username" : "admin"
        "applicationId" : "${local.fusionauth_default_application_id}",
      }
      "user" : {
        "email" : "admin@admin.com",
        "password" : "adminadmin",
        "lastName" : "Admin"
        "firstName" : "Admin",
      }
    }
  )
}
#endregion
