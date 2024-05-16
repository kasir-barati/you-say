export interface OauthCallbackRequestQuery {
  code: string;
  state: string;
  locale: string;
  userState: string;
}
