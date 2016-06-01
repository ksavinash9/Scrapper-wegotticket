const config = {
	scrapping_url_prefix: "http://www.wegottickets.com/searchresults/page/",
	scrapping_url_suffix: "all",
	lists_start: 1,
	lists_end: 689,
	maxConcurrent: 2,
	listThrottle: 5,
	dataPath: "/data/wegottickets",
	mongoDbPath: "localhost:27017/mydb"
}


module.exports = config;