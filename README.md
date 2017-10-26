# GraphQL Auth with JSON Web Tokens

This repo demonstrates some ways you might build authentication and authorization logic into your GraphQL API. GraphQL itself does not prescribe any particular way to do auth and those details are left up to the developer.

The approaches here may or may not be suitable for your own implementation.

## JSON Web Tokens

This GraphQL server uses JSON Web Tokens (JWT) for authorization. You will need some tokens to begin with to test the API. Here are a few you can use:

### JWT With No Scope

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJncmFwaHFsLXRlc3Qtc2VydmVyIiwiaWF0IjoxNTA5MDQxMTE3LCJleHAiOjE1NDA1NzcxMTcsImF1ZCI6ImdyYXBocWwtdGVzdC1hcGkiLCJzdWIiOiIxMjMifQ.tTRbNKT58UqRMqMkf8cLenRZ0qvf15mUl6N6dWyn_Wo
```

### JWT With `write:articles` Scope

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJncmFwaHFsLXRlc3Qtc2VydmVyIiwiaWF0IjoxNTA5MDQxMTE3LCJleHAiOjE1NDA1NzcxMTcsImF1ZCI6ImdyYXBocWwtdGVzdC1hcGkiLCJzdWIiOiIxMjMiLCJzY29wZSI6IndyaXRlOmFydGljbGVzIn0.mupYodqVggdF1fZaiyVdfOGLwY_R3KISGBTCJ7hhH5U
```

The `sub` claim in these tokens is `123` which maps to the same author ID in the supplied data.

The secret key for these tokens is found in the `.env` file. **THIS SECRET KEY IS TERRIBLY WEAK, DO NOT USE IT IN PRODUCTION**.

To test the API, attach one of the tokens to the `Authorization` header in your requests using the `Bearer` scheme. For example:

```
Authorization: Bearer eyJ0...
```

## License

MIT