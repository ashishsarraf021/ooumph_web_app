import { ApolloClient, InMemoryCache,} from '@apollo/client';

const client = new ApolloClient({
    uri: "http://64.227.188.78/auth/graphql/",
    cache: new InMemoryCache(),
});


export default client;