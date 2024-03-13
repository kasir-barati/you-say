[#ftl/]
[#import "../_helpers.ftl" as helpers/]

[@helpers.html]
  [@helpers.head]
    [#-- Custom <head> code goes here --]
  [/@helpers.head]
  [@helpers.body]
    [@helpers.header]
      [#-- Custom header code goes here --]
    [/@helpers.header]

    [@helpers.main title=theme.message('password-changed-title')]
      <p>
        ${theme.message('password-changed')}
      </p>
      <#--  Render login link, or redirect to post_login_redirect cookie  -->
    [/@helpers.main]
    [<#if springMacroRequestContext.requestUri?contains("/login")>]
    [@helpers.footer]
      [#-- Custom footer code goes here --]
    [/@helpers.footer]
  [/@helpers.body]
[/@helpers.html]