# Test `admin.service.ts`

I need just to test my service layer not whole things or even the Prisma. therefore I used the `as any` whenever prisma bother me. BTW i am not sure this should be a good thing. I think it was better to separate our repository layer from our ORM in some way. Why? Because when our repository layer is so entangled with ORM, ORM would be a drag on unit test. Because our return type and input type is very ORMified.
