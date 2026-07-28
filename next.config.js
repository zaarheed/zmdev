module.exports = {
    async redirects() {
        return [
            {
                source: '/officehours',
                // destination: 'https://cal.com/zaarheed/officehours',
                destination: 'https://calendar.app.google/XFoihecQ7yggLX2b8',
                permanent: false,
            },
            {
                source: '/learn',
                destination: 'https://www.zeroshotsgiven.com/bootcamp',
                permanent: false,
            },
        ]
    },
}
