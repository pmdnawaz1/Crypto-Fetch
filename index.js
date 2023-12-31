const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
} = require('graphql');
const axios = require('axios'); // Add Axios for making HTTP requests

// Define GraphQL types
// Define GraphQL types
const CryptoType = new GraphQLObjectType({
  name: 'Crypto',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    symbol: { type: GraphQLString },
    image: { type: GraphQLString },
    currentPrice: { type: GraphQLString },
    marketCap: { type: GraphQLString },
    marketCapRank: { type: GraphQLString },
    fullyDilutedValuation: { type: GraphQLString },
    totalVolume: { type: GraphQLString },
    high24h: { type: GraphQLString },
    low24h: { type: GraphQLString },
    priceChange24h: { type: GraphQLString },
    priceChangePercentage24h: { type: GraphQLString },
    marketCapChange24h: { type: GraphQLString },
    marketCapChangePercentage24h: { type: GraphQLString },
    circulatingSupply: { type: GraphQLString },
    totalSupply: { type: GraphQLString },
    maxSupply: { type: GraphQLString },
    ath: { type: GraphQLString },
    athChangePercentage: { type: GraphQLString },
    athDate: { type: GraphQLString },
    atl: { type: GraphQLString },
    atlChangePercentage: { type: GraphQLString },
    atlDate: { type: GraphQLString },
    roi: { type: GraphQLString },
    lastUpdated: { type: GraphQLString },
  },
});

// Define GraphQL queries
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		cryptos: {
			type: new GraphQLList(CryptoType),
			resolve: async () => {
				try {
					// Fetch cryptocurrency data from CoinGecko API
					const response = await axios.get(
						'https://api.coingecko.com/api/v3/coins/markets',
						{
							params: {
								vs_currency: 'usd', // Replace with your preferred currency
								order: 'market_cap_desc',
								per_page: 10, // Number of cryptocurrencies to fetch
								page: 1,
								sparkline: false,
							},
						}
					);
					console.log(response);
					// Transform and return the relevant data
					return response.data.map((crypto) => ({
						id: crypto.id,
						name: crypto.name,
						symbol: crypto.symbol,
						currentPrice: crypto.current_price,
					}));
				} catch (error) {
					throw error;
				}
			},
		},
	},
});

const schema = new GraphQLSchema({
	query: RootQuery,
});

// Create an Express server
const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true, // Enable GraphQL's web interface for testing
	})
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});