output "you_say_tenant_id" {
  value = fusionauth_tenant.you-say-tenant.id
}

output "default_tenant_id" {
  value = local.fusionauth_default_tenant_id
}

output "you_say_application_id" {
  value = fusionauth_application.you-say-application.id
}

output "default_application_id" {
  value = local.fusionauth_default_application_id
}

output "admin_group_id" {
  value = fusionauth_group.admin-group.id
}
