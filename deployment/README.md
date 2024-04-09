# Variables

Some important notes about SMTP:

> [!CAUTION]
>
> 1. We do not need `fusionauth_email_configuration_username` and `fusionauth_email_configuration_password` for development & test environment. As such I am passing `null` as their default value since when we are using our `fusionauth` module it is asking us to provide its value. But `fusionauth` module will ignore those configurations with null value ([ref](https://developer.hashicorp.com/terraform/language/expressions/types#types)) as though they had been omitted from the beginning.
> 2. `fusionauth_email_configuration_host` for development & test environment uses service names and Docker networking to work. But for production environment it will use a real SMTP.
