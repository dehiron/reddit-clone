import "@fontsource/open-sans/300.css"
import "@fontsource/open-sans/400.css"
import "@fontsource/open-sans/700.css"
import { extendTheme } from "@chakra-ui/react"

const colors = {
  brand: {
    100: 'ff3300',
  },
}

const fonts = {
    body: "Open Sans, sans-serif"
}

const styles = {
    global: () => ({
        body: {
            bg: "gray.200"
        }
    })
}

const components = {
    // Button
}

export const theme = extendTheme({ colors, fonts, styles, components })