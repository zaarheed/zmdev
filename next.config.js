module.exports = {
    async redirects() {
        return [
            {
                source: '/officehours',
                destination: 'https://cal.com/zaarheed/officehours',
                permanent: false,
            },
        ]
    },
}
