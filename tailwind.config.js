const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	// darkMode: "class",
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./constants/**/*.{js,jsx}",
		"./_projects/**/*.mdx",
		"./_posts/**/*.mdx"
	],
	theme: {
		extend: {
			colors: {
				azure: {
					"50": "#E5F2FF",
					"100": "#CCE5FF",
					"200": "#99CBFF",
					"300": "#66B0FF",
					"400": "#3396FF",
					"500": "#007CFF",
					"600": "#0063CC",
					"700": "#004A99",
					"800": "#003266",
					"900": "#001933"
				},
				flesh: {
					"50": "#FFFFFF",
					"100": "#FFFFFF",
					"200": "#FFFFFF",
					"300": "#FED6D6",
					"400": "#FEA5A3",
					"500": "#FD7471",
					"600": "#FC433F",
					"700": "#FC120C",
					"800": "#D20703",
					"900": "#A00602"
				},
				hulk: {
					"50": "#E3F9F0",
					"100": "#CEF4E5",
					"200": "#A4EBCF",
					"300": "#7BE1B9",
					"400": "#51D8A2",
					"500": "#2DC98B",
					"600": "#249F6E",
					"700": "#1A7651",
					"800": "#114C35",
					"900": "#082218"
				},
				mango: {
					"50": "#FFFFFF",
					"100": "#FFFFFF",
					"200": "#FEF8E6",
					"300": "#FDE9B4",
					"400": "#FBDB83",
					"500": "#FACD51",
					"600": "#F9BF1F",
					"700": "#DFA506",
					"800": "#AD8005",
					"900": "#7B5C04"
				},
				eggshell: {
					50: "#ffffff",
					100: "#ffffff",
					200: "#ffffff",
					300: "#fffffc",
					400: "#fcf8f2",
					500: "#f2eee8",
					600: "#e8e4de",
					700: "#dedad4",
					800: "#d4d0ca",
					900: "#cac6c0"
				}
			},
			fontFamily: {
				plex: ["IBM Plex Sans", ...fontFamily.sans]
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					},
				}
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme("colors.zinc.700"),
						a: {
							color: theme("colors.azure.500"),
						}
					}
				},
				dark: {
					css: {
						color: theme("colors.zinc.200"),
						a: {
							color: theme("colors.mango.500"),
						},
						code: {
							color: theme("colors.zinc.100"),
						}
					}
				}
			})
		},
	},
	plugins: [
		require("@tailwindcss/typography")
	],
}
