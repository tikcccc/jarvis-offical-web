Getting Started
Get started instantly with the Paraglide-Next CLI.

npx @inlang/paraglide-next init
npm install
The CLI will ask you which languages you want to support. This can be changed later.

It will:

Create an Inlang Project
Create translation files for each of your languages
Add necessary Provider Components and files
Update your next.config.js file to use the Paraglide-Next Plugin.
Offer to automatically migrate to the Localized navigation APIs if you're using the App Router (recommended)
You can now start your development server and visit /de, /ar, or whatever languages you've set up.

Creating and Using Messages
Your messages live in messages/{languageTag}.json files. You can add messages in these files as key-value pairs of the message ID and the translations.

Use curly braces to add parameters.

// messages/en.json
{
	// The $schema key is automatically ignored
	"$schema": "https://inlang.com/schema/inlang-message-format",

	"hello_world": "Hello World!",
	"greetings": "Greetings {name}."
}
Learn more about the format in the Inlang Message Format Documentation.

Using Messages in Code
Use messages by importing them from @/paraglide/messages.js. By convention, we do a wildcard import as m.

import * as m from "@/paraglide/messages.js"

export function Home() {
	return (
		<>
			<h1>{m.homepage_title()}</h1>
			<p>{m.homepage_subtitle({ some: "param" })}</p>
		</>
	)
}
Only messages used in client components are sent to the client. Messages in Server Components don't impact bundle size.

Using the Language in Code
You can get the current language by calling the languageTag() function.

import { languageTag } from "@/paraglide/runtime"

export function Home() {
	return <h1>{languageTag()}</h1>
}
This is scoped to the current request, it's safe to use in server-components.

Localised Routing
Routing Strategy
A "Routing Strategy" defines how the localised routing is supposed to work in your App.

It's an interface for providing a two-way mapping between the URL and the route that's supposed to be rendered.

Eg: https://example.com/de/ueber-uns ↔ /about

The strategy is also responsible for detecting the langauge based on the current Request.

Most of the time you will not be writing your own Routing Strategy & instead be using a prebuilt one.

Prefix Strategy (default)
Domain Strategy
Localised Navigation APIs
NextJS offers several Navigation APIs. useRouter, usePathname, redirect, permanentRedirect and of course the Link component. We can get localised versions of these using the Navigation({ strategy }) constructor.

By default this is done in src/lib/i18n.ts

// src/lib/i18n.ts
import { Navigation, Middleware, PrefixStrategy } from "@inlang/paraglide-next"
import type { AvailableLanguageTag } from "@/paraglide/runtime"

const strategy = PrefixStrategy<AvailableLanguageTag>()

export const { Link, useRouter, usePathname, redirect, permanentRedirect } = Navigation({
    strategy,
})
We can then use these localised navigation APIs throughout our App.

import { Link } from "@/lib/i18n"

<Link
    href="/"
    className="text-blue-500 hover:text-blue-700"
>
    {m.home_title()}
</Link>
Linking to Pages in Specific Languages
If you want a Link to be in a specific language you can use the locale prop.

<Link href="/about" locale="de">
This is convenient for constructing language switchers.

If you are using router.push to navigate you can pass locale as an option.

function Component() {
	const router = useRouter()
	return (
		<button onClick={() => router.push("/about", { locale: "de" })}>Go to German About page</button>
	)
}
Manually Routing
There are situations where you need to manually get a localized URL. You can do this by calling the getLocalisedUrl method on your Routing Strategy. This will return an UrlObject.

import { strategy } from "@/lib/i18n"

const { pathname } = strategy.getLocalisedUrl(
    // the pathname you want to localise
    "/about", 

    //the language you want to localise to
    "de"

    // If the URL is in a different language than the current
    // Setting this is never harmful but may result in longer URLs
    true 
)

Prefix Strategy (default)
This Routing Strategy adds a language prefix before the pathname to distinguish between different languages.

/de/some-page
/fr/some-page
/some-page Default Language
import { PrefixStrategy } from "@inlang/paraglide-next"
const strategy = PrefixStrategy()
Translated Pathnames
The Prefix Strategy supports using different pathnames for each language with the pathname option.

/de/ueber-uns
/fr/a-propos
/ueber-uns
Pathnames should not include a language prefix or the base path.

const strategy = PrefixStrategy<AvailableLanguageTag>({
	pathname: {
		"/about": {
			en: "/about",
			de: "/ueber-uns",
		},
	},
})
You can use parameters with square brackets. You have to use an identical set of parameters in both the canonical and translated pathnames.

You can use double-square brackets for optional parameters and the spread operator to make it a match-all parameter.

pathname: {
	"/articles/[slug]": {
		en: "/articles/[slug]",
		de: "/artikel/[slug]"
	},
	"/admin/[...rest]": {
		en: "/administration/[...rest]",
		de: "/admin/[...rest]"
	},
}
Using Messages for Pathname translations
You can also use a message as a pathname. The translation will be used as the pathname. You can use parameters here too.

// messages/en.json
{
	"about_pathname": "/about"
}
// messages/de.json
{
	"about_pathname": "/ueber-uns"
}
const strategy = PrefixStrategy<AvailableLanguageTag>({
	pathname: {
		"/about": m.about_pathname, //pass as reference
	},
})
Excluding certain Routes from Localised Routing
You can exclude certain routes from i18n using the exclude option. Pass it a function that returns true/false depending on whether the given pathname should be excluded

const strategy = PrefixStrategy<AvailableLanguageTag>({
		exclude: (pathname) => pathname == "/api" || pathname.startsWith("/api/"),
})
Excluded routes won't be prefixed with the language tag & the middleware will not add Link headers to them.

Other Strategies
Appart from the default Prefix Routing Stragegy there are a few others available:

Domain Strategy
This Strategy uses the domain of a request to determine the language.

import { DomainStrategy } from "@inlang/paraglide-next"
import type { AvailableLanguageTag } from "@/paraglide/runtime"

const strategy = DomainStrategy<AvailableLanguageTag>({
	domains: {
		en: "https://example.com",
		de: "https://example.de",
		fr: "https://fr.example.com",
	},
})
Domains must be unique for each language.

Detection-only Strategy
This strategy exclusively uses the Accept-Language header to detect the language on first visit. Any subsequent visits will use the language set in the NEXT_LOCALE cookie. Routing is not affected in any way.

import { DetectionStrategy } from "@inlang/paraglide-next"
import type { AvailableLanguageTag } from "@/paraglide/runtime"

const strategy = DetectionStrategy<AvailableLanguageTag>()
Manual Language switches only work if JS is enabled when using this strategy.

Custom Strategy
The beatuy of the RoutingStrategy interface is that you can easily create your own routing strategy. All you need to do is implement the following functions:

const MyStrategy: RoutingStrategy<AvailableLanguageTag> = {
	/**
	 * This function is called inside the middleware to determine the language for the current request.
	 *
	 * It's also OK to say you don't know & return undefined. In that case the Language Cookie will be used,
	 * or Language negotiation if no cookie is present.
 	 */
	resolveLocale(request: NextRequest) : AvailableLanguageTag | undefined

	/**
	 * Returns the canonical pathname based on the localised pathname and it's language.
	 *
	 * The canonical pathname is the pathname you would need to get to the page you want
	 * in the `app/` directory if there weren't any i18n routing.
	 *
	 * @example /de/ueber-uns + de -> /about
	 *
	 */
	getCanonicalPath(
		localisedPath: `/${string}`,
		locale: AvailableLanguageTag
	): `/${string}`


	/**
	 * Returns the localized URL that can be used to navigate to the given path in the given language.
	 * It's a URL & not just a pathname so you can add query params and use other domains.
	 *
	 * For some strategies you might need to return different URLs based on if it's a language switch or not.
	 *
	 * @example /about + de -> /de/ueber-uns
	 */
	getLocalisedUrl(
		canonicalPath: `/${string}`,
		targetLocale: AvailableLanguageTag,
		isLanugageSwitch: boolean
	) : import("url").UrlObject
}
To get some inspiration you might want to read the source-code of the built-in strategies.

SEO
Translated Metadata
You'll likely want to have metadata in different languages.

You can use messages in metadata just like everywhere else, as long as you're using generateMetadata instead of exporting metadata

export async function generateMetadata() {
	return {
		title: m.home_metadata_title(),
		description: m.home_metadata_description(),
	}
}
If you were to use export const metadata your metadata would always end up in the source language.

Alternate Links / Sitemap
Search engines like Google expect you to tell them about translated versions of your pages. Paraglide-Next does this by default by adding the Link Header to requests.

If you also want to instead have the alternate links in your page's <head> you can use the generateAlternateLinks function to generate the links. In your root layout, add the following:

// src/app/layout.tsx
import { generateAlternateLinks } from "@inlang/paraglide-next"
import { strategy } from "@/lib/i18n"
import type { Metadata, ResolvingMetadata } from "next"

export const generateMetadata = (params: any, parent: ResolvingMetadata): Metadata => {
	return {
		alternates: {
			languages: generateAlternateLinks({
				origin: "https://example.com", // the origin of your site
				strategy: strategy,
				resolvingMetadata: parent,
			}),
		},
	}
}
You don't need to add the translated versions of your site to your sitemap, although it doesn't hurt if you do. Adding one language is sufficient.

Right-to-Left Support
Just define a map of all languages to their text-direction & index into it.

// src/app/layout.tsx
import { languageTag, type AvailableLanguageTag } from "@/paraglide/runtime.js"

// This is type-safe & forces you to keep it up-to-date
const direction: Record<AvailableLanguageTag, "rtl" | "ltr"> = {
	en: "ltr",
	ar: "rtl",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<LanguageProvider>
			<html lang={languageTag()} dir={direction[languageTag()]}>
	//...
For now we discourage using the Intl.Locale API to detect text-direction as it's still poorly supported

Usage on the Server
In general you can use messages and the languageTag() function on the server without issues.

There are a few things to be aware of:

Messages are just functions. Make sure they are called somewhere that's evaluated for every request.
Using the Language in Server Actions
Use the initializeLanguage function at the top of your server-action file to make sure the language is available.

// src/app/actions.ts
"use server"
import { initializeLanguage } from "@inlang/paraglide-next"
import { languageTag } from "@/paraglide/runtime"

initializeLanguage() //call it at the top of the file

export async function someAction() {
	languageTag() // "de"
}

export async function someOtherAction() {
	languageTag() // "de"
}
Chaining Middleware
Paraglide-Next comes with middleware. Often you will want to chain that middleware with your own.

Just call Paraglide-Next's middleware inside your own middleware function. Pass it the request and use the returned response.

// src/middleware.ts
import { middleware as paraglide } from "@/lib/i18n"
export function middleware(request: NextRequest) {
	//do something with the request
	const response = paraglide(request)
	// do something with the response
	return response
}
Using the language in Middleware
In some cases you may need to access the language of a request inside the middleware itself. For this the middleware function provides a detectLanguage function.

// src/middleware.ts
import { middleware as paraglideMiddleware } from "@/lib/i18n"
export function middleware(request: NextRequest) {
	const lang = paraglideMiddleware.detectLanguage(request)
	//do something with the language...
	// still use the paraglide middleware
	return paraglideMiddleware(request)
}

Pages Router (Legacy)
For compatability with older projects we do offer compatability with the pages router.

Setup
In the pages router we use Next's built-in i18n routing.

If it wasn't set up already the paraglide-next init command will have set it up for you.

It will also have added the <ParaglideJS> component to your root layout which makes the language available to all messages.

Apart from that we just need the regular Paraglide-JS Setup. Create an Inlang project an add messages in messages/{languageTag}.json. This should also have been done by the CLI.

Limitations
The Pages Router is only supported for compatability with older NextJS projects & doesn't benefit from most of the Routing Features in Paraglide-Next. Routing Strategies, Middleware and the Localised Navigation APIs are not supported.

Manual Setup
Ideally you would use the @inlang/paraglide-next init command to initialize your app, but in case that fails for some reason or if you're updating from an older version we also provide manual setup instructions.

App Router
1. Install Dependencies
(p)npm install @inlang/paraglide-next
2. Create an Inlang Project
The Inlang Project manages your localisation settings and messages. You can initialize one with the @inlang/paraglide-js init command.

npx @inlang/paraglide-js init
3. Add the Paraglide-Next Plugin
In next.config.mjs use the Paraglide-Next plugin. This will make sure to re-run the compiler whenever necessary and make any necessary virtual modules available.

In next.config.mjs add the following:

import { paraglide } from '@inlang/paraglide-next/plugin'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
// your usual next config
}
 
export default paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide'
  },
  ...nextConfig
})
If you're still using next.config.js it's recommended that you switch the config over to next.config.mjs

4. Add the necessary files
You need to create two files.

// src/lib/i18n.ts
import { Navigation, Middleware, PrefixStrategy } from "@inlang/paraglide-next"
import type { AvailableLanguageTag } from "@/paraglide/runtime"
import * as m from "@/paraglide/messages"

export const strategy = PrefixStrategy<AvailableLanguageTag>()

export const middleware = Middleware({ strategy })
export const { Link, useRouter, usePathname, redirect, permanentRedirect } = Navigation({ strategy })
// src/middleware.ts
export { middleware } from "@/lib/i18n"
5. Add the Language Provider
Add the LanguageProvider component. It will make the language available on the server. Also set the lang attribute to the current language.

// src/app/root.tsx
import { LanguageProvider } from "@inlang/paraglide-next"
import { languageTag } from "@/paraglide/runtime.js"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<LanguageProvider>
			<html lang={languageTag()}>
				<body>
					<main className="container">{children}</main>
				</body>
			</html>
		</LanguageProvider>
	)
}
You may have to start your dev server once before @/paraglide/runtime.js is available

6. Set up i18n routing
Finally, go through your existing app code & use the localised versions of the different navigation APIs exported from @/lib/i18n

- import Link from "next/link"
+ import { Link } from "@/lib/i18n"

- import { useRouter, usePathname } from "next/navigation"
+ import { useRouter, usePathname } from "@/lib/i18n"
Pages Router
Ideally you would use the @inlang/paraglide-next init command to initialize your app, but in case that fails for some reason or if you're updating from an older version we also provide manual setup instructions.

1. Install Dependencies
(p)npm install @inlang/paraglide-next
2. Create an Inlang Project
The Inlang Project manages your localisation settings and messages. You can initialize one with the @inlang/paraglide-js init command.

npx @inlang/paraglide-js init
3. Add the Paraglide-Next Plugin
In next.config.mjs use the Paraglide-Next plugin. This will make sure to re-run the compiler whenever necessary and make any necessary virtual modules available.

In next.config.mjs add the following:

import { paraglide } from '@inlang/paraglide-next/plugin'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
// your usual next config
}
 
export default paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide'
  },
  ...nextConfig
})
If you're still using next.config.js it's recommended that you switch the config over to next.config.mjs

4. Set up i18n routing
The Pages router comes with i18n routing out of the box. Paraglide simply hooks into that for language detection & routing.

Set it up in next.config.mjs:

import { paraglide } from '@inlang/paraglide-next/plugin'
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ['en', 'de-CH'],
        defaultLocale: 'en'
    }
}
 
export default paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide'
  },
  ...nextConfig
})
5. Add the ParaglideJS Provider
Finally, add the ParaglideJS component to your _app.tsx file.

// src/pages/_app.tsx
import type { AppProps } from "next/app"
import { ParaglideJS } from "@inlang/paraglide-next/pages"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ParaglideJS>
			<Component {...pageProps} />
		</ParaglideJS>
	)
}

i18n library for next js
Paraglide JS can be used with NextJS for both SSR and SSG modes. Below are examples for both modes.

Next JS SSR example
This is an example of how to use Paraglide with Next JS with SSR. The source code can be found here.

NextJS is tech-debt plagued. If you start your app or website from scratch, we highly recommend using a vite-based framework. Read this comment.

The setup has been reported as fragile for advances use-cases #407. Official NodeJS middleware support of NextJS could solve these problems. Use next-intl if you need a more stable setup.

Features
Feature	Supported
CSR	✅
SSR	✅
SSG	❌
URLPattern	✅
Any Strategy	✅
Pull requests that improve this example are welcome.

Getting started
Install paraglide js
npx @inlang/paraglide-js@latest init
Add the webpack plugin to the next.config.js file:
The URL Pattern ensures that localizeHref() includes the locale in the path.

import { paraglideWebpackPlugin } from "@inlang/paraglide-js";

/**
 * @type {import('next').NextConfig}
 */
export default {
+	webpack: (config) => {
+		config.plugins.push(
+			paraglideWebpackPlugin({
+				outdir: "./src/paraglide",
+				project: "./project.inlang",
+       strategy: ["url", "cookie", "baseLocale"],
+			})
+		);
+		return config;
	},
};
Add the paraglideMiddleware() to src/middleware.ts
app/
  - index.tsx
+ - middleware.ts
  - about.tsx
  - ...
import { NextRequest, NextResponse } from "next/server";
import { paraglideMiddleware } from "./paraglide/server";

export function middleware(request: NextRequest) {
	return paraglideMiddleware(request, ({ request, locale }) => {
		request.headers.set("x-paraglide-locale", locale);
		request.headers.set("x-paraglide-request-url", request.url);
		return NextResponse.rewrite(request.url, request);
	});
}
Add locale handling in the root layout
NextJS does not support AsyncLocalStorage. Hence, we need to use a workaround to render the correct locale. Please upvote this issue https://github.com/vercel/next.js/issues/69298.

The warning for "headers must be async" has no effect on production. NextJS needs to fix their API or introduce AsyncLocalStorage. More context here https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658

+import {
+	assertIsLocale,
+	baseLocale,
+	getLocale,
+	Locale,
+	overwriteGetLocale,
+} from "../paraglide/runtime";
import React, { cache } from "react";
import { headers } from "next/headers";

+const ssrLocale = cache(() => ({ locale: baseLocale, origin: "http://localhost" }));

// overwrite the getLocale function to use the locale from the request
+overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));
+overwriteGetUrlOrigin(() => ssrLocale().origin);

export default async function RootLayout({
	children,
}) {
	// @ts-expect-error - headers must be sync
	// https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658
+	ssrLocale().locale = headers().get("x-paraglide-locale") as Locale;
  // @ts-expect-error - headers must be sync
	ssrLocale().origin = new URL(headers().get("x-paraglide-request-url")).origin; 

	return (
		<html lang={getLocale()}>
			<body>
				{children}
			</body>
		</html>
	);
}

Next JS SSG example
This is an example of how to use Paraglide with Next JS with SSG. The source code can be found here.

NextJS is tech-debt plagued. If you start your app or website from scratch, we highly recommend using a vite-based framework. Read this comment.

Features
Feature	Supported
CSR	✅
SSR	✅
SSG	✅
URLPattern	❌
Any Strategy	❌
The SSG example is relies on having the locale prefixed in the path like /en/page.

Pull requests that improve this example are welcome.

Getting started
Install paraglide js
npx @inlang/paraglide-js@latest init
Add the webpack plugin to the next.config.js file:
The URL Pattern ensures that localizeHref() includes the locale in the path.

import { paraglideWebpackPlugin } from "@inlang/paraglide-js";

/**
 * @type {import('next').NextConfig}
 */
export default {
+	webpack: (config) => {
+		config.plugins.push(
+			paraglideWebpackPlugin({
+				outdir: "./src/paraglide",
+				project: "./project.inlang",
+       strategy: ["url", "cookie", "baseLocale"],
+				urlPatterns: [
+					{
+						pattern: 'https://:domain(.*)/:path*',
+						localized: [
+							['de', 'https://:domain(.*)/de/:path*'],
+							['en', 'https://:domain(.*)/:path*'],
+						],
+					},
+				],
+			})
+		);
+		return config;
	},
};
Create a [locale] folder and move all of your pages in there
app/
  - [locale]/
    - index.tsx
    - about.tsx
    - ...
Add the locale handling to your root layout
app/
  - [locale]/
    - index.tsx
+   - layout.tsx
    - about.tsx
    - ...

// needed for SSG
+export function generateStaticParams() {
+	return [{ locale: "en" }, { locale: "de" }];
+}

// scopes the locale per request
+let ssrLocale = cache(() => ({
+	locale: baseLocale,
+}));

// overwrite the getLocale function to use the locale from the request
+overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));

export default async function RootLayout({
	children,
	params,
}: {
	children: any;
	params: any;
}) {
	// can't use async params because the execution order get's screwed up.
	// this is something nextjs has to fix
+	ssrLocale().locale = params.locale;
	return (
		<html lang={getLocale()}>
			<body>
				{children}
			</body>
		</html>
	);
}

Usage
Once you've set up Paraglide with Next.js using either the SSR or SSG approach, see the basics documentation for more information on how to use Paraglide's messages, parameters, and locale management.

Basics
Adding and removing locales
To add a new locale, add it to the locales array in <project0name>.inlang/settings.json file.

// project.inlang/settings.json

{
  "baseLocale": "en",
+ "locales": ["en", "de"]
}
Adding and editing messages
These examples use the inlang message format plugin that ships by default, but Paraglide works with any format plugin that produces the expected message files. Swap the plugin in `project.inlang/settings.json` if you prefer a different storage format—see the plugin directory.
Messages are stored in messages/{locale}.json as key-value pairs. You can add parameters with curly braces.

// messages/en.json
{
+ 	"greeting": "Hello {name}!"
}
Importing messages
After compiling your project, you'll have access to all your messages through the generated messages.js file:

// Import all messages at once
import { m } from "./paraglide/messages.js";

// Use a message
console.log(m.hello_world()); // "Hello World!"
Using parameters
For messages with parameters, simply pass an object with the parameter values:

// messages/en.json
// { "greeting": "Hello {name}!" }

import { m } from "./paraglide/messages.js";

// Pass parameters as an object
console.log(m.greeting({ name: "Samuel" })); // "Hello Samuel!"
Forcing a locale
You can override the locale by passing a locale option as the second parameter:

This is particularly useful in server-side contexts where you might need to render content in multiple languages regardless of the user's current locale.
import { m } from "./paraglide/messages.js";

// Force the message to be in German
console.log(m.greeting({ name: "Samuel" }, { locale: "de" })); // "Hallo Samuel!"
Setting the locale
To change the current locale, use the setLocale function:

import { setLocale } from "./paraglide/runtime.js";

// Change locale to German
setLocale("de");
Disabling reloading
By default, setLocale() triggers a full page reload. This is a deliberate design decision that:

Enables a small, efficient runtime without complex state management
Makes Paraglide work in any framework without requiring framework-specific adapters
Follows the pattern used by major websites like YouTube, as language switching is an infrequent action that doesn't justify the complexity of a no-reload approach
If you need to change the locale without a page reload, you can pass { reload: false } as the second parameter, but then you'll need to handle UI updates yourself.

// Change locale without reloading the page
setLocale("de", { reload: false });
Getting the current locale
To get the current locale, use the getLocale function:

import { getLocale } from "./paraglide/runtime.js";

console.log(getLocale()); // "de"
Routing
Automatic <a> tag localization has been removed in v2. See changelog and this issue for more information.

You must explicitly use localizeHref() for URL localization:

<a href={localizeHref("/blog")}>Blog</a>
Important: If you route to a different locale, ensure a reload happens afterwards. See https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#switching-locales-via-links-doesnt-work

Choosing your strategy
You likely want to use one of the built-in strategies. Visit the strategy documentation to learn more.

Message keys and organization
Paraglide supports nested keys through bracket notation but recommends flat keys due to management complexity. Learn more about message key structures and best practices.

// messages/en.json
{
  // Recommended: flat keys with snake_case
  "user_profile_title": "User Profile",
  
  // Also supported but not recommended: nested keys
  "user": {
    "profile": {
      "title": "User Profile"
    }
  }
}
import { m } from "./paraglide/messages.js";

console.log(m.user_profile_title()); // "User Profile" (recommended)
console.log(m["user.profile.title"]()); // "User Profile" (also works)
Dynamically calling messages
You can dynamically call messages by specifying what messages you expect beforehand. Specifying the messages beforehand preserves tree-shaking.

import { m } from "./paraglide/messages.js";

const messages = {
	greeting: m.greeting,
	goodbye: m.goodbye,
};

let messageKey = "greeting";

console.log(messages[messageKey]());
// "Hello World!"
Advanced usage
Choosing your strategy
Server-side rendering
Multi-tenancy

Message Keys and Structure
Nested keys are supported but not recommended
Paraglide JS supports nested keys through bracket notation syntax m["something.nested"](), which simulates nesting without actually creating nested JavaScript objects. This approach leverages TypeScript's template literal types to provide type safety while maintaining the flat structure that enables tree-shaking.

While nested keys are supported, we still recommend using flat keys. Flat keys align better with how databases, applications, and compilers naturally work — even though the bracket notation keeps the generated modules tree-shakeable.
Why we recommend flat keys
1. Flat lists are the native format
Databases operate on flat structures: Messages are stored in SQLite internally, which naturally uses flat key-value pairs
Applications use flat lookups: At runtime, messages are accessed by key, not by traversing nested objects
Compilers work with flat lists: The compilation process transforms each message into an individual function
2. Nested keys create unnecessary complexity
While nested keys might seem nice for developers initially, they create pain for everyone else in the ecosystem:

Translators: Have to understand hierarchical structures instead of simple key-value pairs
Build tools: Need to parse and transform nested structures into flat lists
Developer experience: Flat keys compile to direct function names, which provide richer IDE support such as go-to-definition and auto-imports
Consistency across tooling: Flat keys mirror how translators, design tools, and message catalogs typically represent content
How to use nested keys (if you must)
If you have existing messages with dot notation, you can access them using bracket notation:

// messages/en.json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.contact": "Contact"
}
import { m } from "./paraglide/messages.js";

// Access with bracket notation
console.log(m["nav.home"]()); // "Home"
console.log(m["nav.about"]()); // "About"

// TypeScript provides autocomplete for these keys
type NavKey = "nav.home" | "nav.about" | "nav.contact";
const key: NavKey = "nav.home";
console.log(m[key]());
The bracket notation uses TypeScript's template literal types feature to maintain type safety while keeping the underlying structure flat. This is purely a TypeScript compile-time feature - at runtime, these are still individual functions.
Recommended approach: Flat keys
Instead of nesting, use prefixes to organize related messages:

// messages/en.json
{
  "nav_home": "Home",
  "nav_about": "About", 
  "nav_contact": "Contact",
  "footer_privacy": "Privacy Policy",
  "footer_terms": "Terms of Service"
}
Benefits of this approach:

import { m } from "./paraglide/messages.js";

// ✅ Direct function calls with perfect tree-shaking
console.log(m.nav_home()); // "Home"

// ✅ Better IDE support with go-to-definition
// ✅ Cleaner imports with auto-import
// ✅ No runtime overhead
Working with dynamic keys
For dynamic menu systems, create explicit mappings:

import { m } from "./paraglide/messages.js";

// With flat keys (recommended)
const navMessages = {
  home: m.nav_home,
  about: m.nav_about,
  contact: m.nav_contact,
} as const;

// With nested keys (if needed)
const menuItems = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
] as const;

menuItems.forEach(item => {
  const label = m[item.key]();
  console.log(`<a href="${item.href}">${label}</a>`);
});
Migration guide
If you're migrating from a library that uses nested keys:

Option 1: Keep dots in keys (minimal changes)
// messages/en.json
{
-  "nav": {
-    "home": "Home",
-    "about": "About"
-  }
+  "nav.home": "Home",
+  "nav.about": "About"
}
// Access with bracket notation
const label = m["nav.home"]();
Option 2: Flatten to underscores (recommended)
// messages/en.json
{
-  "nav": {
-    "home": "Home",
-    "about": "About"
-  }
+  "nav_home": "Home",
+  "nav_about": "About"
}
// Access as direct functions
const label = m.nav_home();

Strategy
Paraglide JS comes with various strategies to determine the locale out of the box.

The strategy is defined with the strategy option. Strategies are evaluated in order - the first strategy that successfully returns a locale will be used, and subsequent strategies won't be checked. Think of the array as a simple fallback chain: each strategy is attempted until one succeeds, keeping the API predictable.

In the example below, the cookie strategy first determines the locale. If no cookie is found (returns undefined), the baseLocale is used as a fallback.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["cookie", "baseLocale"]
})
Strategy order matters: because the array is a fallthrough list, earlier strategies have priority. Strategies that always resolve a locale (like url with wildcards or baseLocale) should typically be placed last as fallbacks, since they prevent subsequent strategies from being evaluated. For example, placing preferredLanguage before localStorage means the browser's language will always win and a user's manual selection in localStorage will never take effect.

Common Strategy Patterns
Here are some common strategy patterns and when to use them:

URL as source of truth (default behavior)
strategy: ["url", "baseLocale"];
Use this when the URL should always determine the locale. The URL pattern (with wildcards) will always resolve, making baseLocale a safety fallback only.

Prioritize user preferences
strategy: ["localStorage", "cookie", "url", "baseLocale"];
Use this when you want returning visitors to see content in their previously selected language, regardless of the URL they land on. The URL only determines locale if no preference is stored.

Automatic language detection with persistent override
strategy: ["localStorage", "preferredLanguage", "url", "baseLocale"];
Use this when you want first-time visitors to see content in their browser's language but still allow manual language changes to persist via localStorage.

The fallback chain flows left to right: localStorage → preferredLanguage → url → baseLocale. Because localStorage is first, a stored selection overrides the browser setting. If it's missing, the arrow falls through to preferredLanguage, then url, and finally baseLocale.

Built-in strategies
cookie
The cookie strategy determines the locale from a cookie.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["cookie"]
})
baseLocale
Returns the baseLocale defined in the settings.

It is useful as a fallback strategy if no other strategy returns a locale, for example, if a cookie has not been set yet.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["cookie", "baseLocale"]
})
globalVariable
Uses a global variable to determine the locale.

This strategy is only useful in testing environments or to get started quickly. Setting a global variable can lead to cross-request issues in server-side environments, and the locale is not persisted between page reloads in client-side environments.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["globalVariable"]
})
preferredLanguage
Automatically detects the user's preferred language from browser settings or HTTP headers.

On the client: Uses navigator.languages
On the server: Uses the Accept-Language header
compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["preferredLanguage", "baseLocale"]
})
The strategy attempts to match locale in order of user preference:

First try exact matches (e.g., "en-US" if supported)
Falls back to base language codes (e.g., "en")
For example:

If user prefers fr-FR,fr;q=0.9,en;q=0.7 and your app supports ["en", "fr"], it will use fr
If user prefers en-US and your app only supports ["en", "de"], it will use en
localStorage
Determine the locale from the user's local storage.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["localStorage"]
})
url
Determine the locale from the URL (pathname, domain, etc) using the urlPatterns configuration.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["url", "cookie"],
+	// The url strategy uses these patterns (or defaults if not specified)
+	urlPatterns: [/* your patterns */]
})
The URL-based strategy uses the web standard URLPattern to match and localize URLs based on your urlPatterns configuration. See URL Patterns configuration below for detailed examples.

**Default URL Patterns**: If you don't specify `urlPatterns`, Paraglide uses a default pattern with a wildcard `/:path(.*)?` that matches any path. For paths without a locale prefix, this resolves to your base locale. This is why the `url` strategy always finds a match by default.
Use https://urlpattern.com/ to test your URL patterns.

**URL Strategy with Wildcards**: When using wildcard patterns like `/:path(.*)?` (which is the default), the URL strategy will **always** resolve to a locale (typically the base locale for paths without a locale prefix). This makes it act as an "end condition" in your strategy array - any strategies placed after it will never be evaluated.
If you want to prioritize user preferences (from localStorage, cookies, etc.) over the URL, place those strategies before the URL strategy in your array:

// ✅ User preference is checked first
strategy: ["localStorage", "preferredLanguage", "url"];

// ❌ localStorage will never be checked because URL always resolves
strategy: ["url", "localStorage", "preferredLanguage"];
Client-side redirects
The server-side paraglideMiddleware() uses the shouldRedirect() helper to keep URLs and locales in sync. Single-page apps can call the same helper on the client to mirror that behaviour.

import { redirect } from "@tanstack/router";
import { shouldRedirect } from "./paraglide/runtime.js";

export const beforeLoad = async ({ location }) => {
	const decision = await shouldRedirect({ url: location.href });

	if (decision.shouldRedirect) {
		throw redirect({ to: decision.redirectUrl.href });
	}
};
shouldRedirect() accepts either a Request (server) or a URL (client). It evaluates your configured strategies in order, returning both the winning locale and the canonical URL so you never have to duplicate redirect logic.

URL Patterns Configuration
The urlPatterns configuration determines how the url strategy matches and resolves locales from URLs.

Locale prefixing
https://example.com/about
https://example.com/de/about
compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		{
			pattern: "/:path(.*)?",
			localized: [
				["de", "/de/:path(.*)?"],
				// ✅ make sure to match the least specific path last
				["en", "/:path(.*)?"],
			],
		},
	],
});
Why the wildcard pattern always resolves: In this configuration, the pattern /:path(.*)? matches any path. When a user visits /about (without a locale prefix), it matches the English pattern /:path(.*)? and resolves to the en locale. This is why the URL strategy acts as an "end condition" - it will always find a match when using wildcards.

This is also the default behavior if you don't specify urlPatterns at all.

[!NOTE] Frameworks such as SvelteKit often model locale aware routes with a required [locale] segment. If you also want to prefix your default locale (similar to the prefixDefaultLanguage: "always" option from the legacy Paraglide v1 adapter), you need to add an explicit pattern for the root path before the wildcard. Otherwise / will first match /:path(.*)?, redirect to /en/, and then get redirected again to /en/en once the trailing slash is normalized.

compile({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["url", "cookie"],
        urlPatterns: [
                {
                        pattern: "/",
                        localized: [
                                ["en", "/en"],
                                ["fr", "/fr"],
                        ],
                },
                {
                        pattern: "/:path(.*)?",
                        localized: [
                                ["en", "/en/:path(.*)?"],
                                ["fr", "/fr/:path(.*)?"],
                        ],
                },
        ],
});
Adding the dedicated root pattern ensures the homepage resolves directly to the correct locale prefix without an extra redirect loop, while the wildcard keeps handling every other route.

Translated pathnames
For pathnames where you want to localize the structure and path segments of the URL, you can use different patterns for each locale. This approach enables language-specific routes like /about in English and /ueber-uns in German.

https://example.com/about
https://example.com/ueber-uns
Here's a simple example with translated path segments:

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		// Specific translated routes
		{
			pattern: "/about",
			localized: [
				["en", "/about"],
				["de", "/ueber-uns"],
			],
		},
		{
			pattern: "/products/:id",
			localized: [
				["en", "/products/:id"],
				["de", "/produkte/:id"],
			],
		},
		// Wildcard pattern for untranslated routes
		// This allows you to incrementally translate routes as needed
		{
			pattern: "/:path(.*)?",
			localized: [
				["en", "/:path(.*)?"],
				["de", "/:path(.*)?"],
			],
		},
	],
});
Domain-based localization
https://example.com/about
https://de.example.com/about
compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		// Include the localhost domain as otherwise the pattern will
		// always match and the path won't be localized
		{
			pattern: "http://localhost::port?/:path(.*)?",
			localized: [
				["en", "http://localhost::port?/en/:path(.*)?"],
				["de", "http://localhost::port?/de/:path(.*)?"],
			],
		},
		// production pattern which uses subdomains like de.example.com
		{
			pattern: "https://example.com/:path(.*)?",
			localized: [
				["en", "https://example.com/:path(.*)?"],
				["de", "https://de.example.com/:path(.*)?"],
			],
		},
	],
});
Adding a base path
You can add a base path to your URL patterns to support localized URLs with a common base path.

For example, with the base path set to "shop":

runtime.localizeHref("/about") will return /shop/en/about
runtime.deLocalizeHref("/about") will return /shop/about
When using a base path, it's important to make it optional using the {basepath/}? syntax with curly braces and the ? modifier. This ensures that paths without the base path will still be properly matched and have the base path added during localization.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		{
			pattern: "/{shop/}?:path(.*)?",
			localized: [
				["en", "/{shop/}?en/:path(.*)?"],
				["de", "/{shop/}?de/:path(.*)?"],
			],
		},
	],
});
This configuration enables:

Original URL	Localized URL (EN)	Localized URL (DE)	Notes
/about	/shop/en/about	/shop/de/about	Path without base path gets base path added
/shop/about	/shop/en/about	/shop/de/about	Path with base path gets properly localized
The curly braces {} with the ? modifier ensure that the group is treated as optional, allowing both URLs with and without the base path to be matched and properly localized.

Making URL patterns unavailable in specific locales
You can configure certain URL patterns to be unavailable in specific locales by redirecting them to a 404 page or any other designated error page.

This is useful when some content or features should only be accessible in certain languages.

https://example.com/specific-path       // Available in English
https://example.com/de/404              // Redirected to 404 in German
To implement this, map the pattern to your 404 page URL for the locales where the content should be unavailable:

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		// 404 page definition.
		//
		// 💡 make sure to define the 404 pattern
		// before a catch all pattern
		{
			pattern: "/404",
			localized: [
				["en", "/404"],
				["de", "/de/404"],
				// defining paths for locales that should not
				// be caught by the catch all pattern
				//
				// this will be matched first and the catch all
				// pattern will not be triggered and a redirect
				// from /de/unavailable to /de/404 will be triggered
				["de", "/de/unavailable"],
			],
		},
		// Path that's only available in English
		{
			pattern: "/specific-path",
			localized: [
				["en", "/specific-path"], // Normal path in English
				["de", "/de/404"], // Redirects to 404 in German
			],
		},
		// Catch-all pattern for other routes
		{
			pattern: "/:path(.*)?",
			localized: [
				["en", "/:path(.*)?"],
				["de", "/de/:path(.*)?"],
			],
		},
	],
});
When a user tries to access /specific-path in German, they will be redirected to /de/404 instead. This approach allows you to:

Make certain content available only in specific languages
Create locale-specific restrictions for particular routes
Implement gradual rollouts of features by language
Handle legacy URLs that might only exist in certain locales
Note that other paths will still work normally through the catch-all pattern, so only the specifically configured paths will be unavailable.

Troubleshooting URL patterns
When working with URL patterns, there are a few important considerations to keep in mind:

Excluding paths is not supported
URLPattern does not support negative lookahead regex patterns.

The decision to not support negative lookaheads is likely related to ReDoS (Regular Expression Denial of Service) attacks. Read this blog post or the CVE on GitHub.

Pattern order matters
URL patterns are evaluated in the order they appear in the urlPatterns array. The first pattern that matches a URL will be used. This means that more specific patterns should come before more general patterns.

urlPatterns: [
	// ❌ INCORRECT ORDER: The wildcard pattern will match everything,
	// so the specific pattern will never be reached
	{
		pattern: "https://example.com/:path(.*)?", // This will match ANY path
		localized: [
			["en", "https://example.com/:path(.*)?"],
			["de", "https://example.com/de/:path(.*)?"],
		],
	},
	{
		pattern: "https://example.com/blog/:id", // This will never be reached
		localized: [
			["en", "https://example.com/blog/:id"],
			["de", "https://example.com/de/blog/:id"],
		],
	},
];

// ✅ CORRECT ORDER: Specific patterns first, then more general patterns
urlPatterns: [
	{
		pattern: "https://example.com/blog/:id", // Specific pattern first
		localized: [
			["en", "https://example.com/blog/:id"],
			["de", "https://example.com/de/blog/:id"],
		],
	},
	{
		pattern: "https://example.com/:path(.*)?", // General pattern last
		localized: [
			["en", "https://example.com/:path(.*)?"],
			["de", "https://example.com/de/:path(.*)?"],
		],
	},
];
Localized pattern order matters too
Within each pattern's localized array, the order of locale patterns also matters. When localizing a URL, the first matching pattern for the target locale will be used. Similarly, when delocalizing a URL, patterns are checked in order.

This is especially important for path-based localization where one locale has a prefix (like /de/) and another doesn't. In these cases, put the more specific pattern (with prefix) first.

// ❌ INCORRECT ORDER: The first pattern is too general
{
  pattern: "https://example.com/:path(.*)?",
  localized: [
    ["en", "https://example.com/:path(.*)?"], // This will match ANY path
    ["en", "https://example.com/en/blog/:id"], // This specific pattern will never be reached
  ],
}

// ✅ CORRECT ORDER: Specific patterns first, then more general patterns
{
  pattern: "https://example.com/:path(.*)?",
  localized: [
    ["en", "https://example.com/en/blog/:id"], // Specific pattern first
    ["en", "https://example.com/:path(.*)?"], // General pattern last
  ],
}

// ❌ INCORRECT ORDER FOR DELOCALIZATION: Generic pattern first will cause problems
{
  pattern: "/:path(.*)?",
  localized: [
    ["en", "/:path(.*)?"],      // Generic pattern will match everything including "/de/about"
    ["de", "/de/:path(.*)?"],   // Pattern with prefix won't be reached for delocalization
  ],
}

// ✅ CORRECT ORDER: More specific patterns with prefixes should come first
{
  pattern: "/:path(.*)?",
  localized: [
    ["de", "/de/:path(.*)?"],   // Specific pattern with prefix first
    ["en", "/:path(.*)?"],      // Generic pattern last
  ],
}
Example: Multi-tenant application with specific routes
For a multi-tenant application with specific routes, proper pattern ordering is crucial:

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
	strategy: ["url", "cookie"],
	urlPatterns: [
		// Specific product routes first
		{
			pattern: "https://:tenant.example.com/products/:id",
			localized: [
				["en", "https://:tenant.example.com/products/:id"],
				["de", "https://:tenant.example.com/produkte/:id"],
				["fr", "https://:tenant.example.com/produits/:id"],
			],
		},
		// Specific category routes next
		{
			pattern: "https://:tenant.example.com/categories/:name",
			localized: [
				["en", "https://:tenant.example.com/categories/:name"],
				["de", "https://:tenant.example.com/kategorien/:name"],
				["fr", "https://:tenant.example.com/categories/:name"],
			],
		},
		// General wildcard pattern last
		{
			pattern: "https://:tenant.example.com/:path(.*)?",
			localized: [
				["en", "https://:tenant.example.com/:path(.*)?"],
				["de", "https://:tenant.example.com/de/:path(.*)?"],
				["fr", "https://:tenant.example.com/fr/:path(.*)?"],
			],
		},
	],
});
With this configuration:

Product URLs like https://acme.example.com/products/123 will use the specific product pattern
Category URLs like https://acme.example.com/categories/electronics will use the specific category pattern
All other URLs will fall back to the general pattern
Write your own strategy
Write your own cookie, http header, or i18n routing based locale strategy to integrate Paraglide into any framework or app.

Only two APIs are needed to define this behaviour and adapt Paraglide JS to your requirements:

overwriteGetLocale defines the getLocale() function that messages use to determine the locale
overwriteSetLocale defines the setLocale() function that apps call to change the locale
Because the client and server have separate Paraglide runtimes, you will need to define these behaviours separately on the client and server.

The steps are usually the same, irrespective of the strategy and framework you use:

Use overwriteGetLocale() function that reads the locale from a cookie, HTTP header, or i18n routing.
Handle any side effects of changing the locale and trigger a re-render in your application via overwriteSetLocale() (for many apps, this may only be required on the client side).
Read the architecture documentation to learn more about's Paraglide's inner workings.

Dynamically resolving the locale (cookies, http headers, i18n routing, etc.)
To dynamically resolve the locale, pass a function that returns the locale to getLocale(). You can use this to get the locale from the documentElement.lang attribute, a cookie, a locale route, or any other source.

import { m } from "./paraglide/messages.js";
import { overwriteGetLocale } from "./paraglide/runtime.js";

overwriteGetLocale(() => document.documentElement.lang /** en */);

m.orange_dog_wheel(); // Hello world!
On the server, you might determine the locale from a cookie, a locale route, a http header, or anything else. When calling overwriteGetLocale() on the server, you need to be mindful of race conditions caused when multiple requests come in at the same time with different locales.

To avoid this, use AsyncLocaleStorage in Node, or its equivalent for other server-side JS runtimes.

import { m } from "./paraglide/messages.js";
import { overwriteGetLocale, baseLocale } from "./paraglide/runtime.js";
import { AsyncLocalStorage } from "node:async_hooks";
const localeStorage = new AsyncLocalStorage();

overwriteGetLocale(() => {
	//any calls to getLocale() in the async local storage context will return the stored locale
	return localeStorage.getStore() ?? baseLocale;
});

export function onRequest(request, next) {
	const locale = detectLocale(request); //parse the locale from headers, cookies, etc.
	// set the async locale storage for the current request
	// to the detected locale and let the request continue
	// in that context
	return localeStorage.run(locale, async () => await next());
}
Custom strategies
In addition to overwriting the getLocale() and setLocale() functions, Paraglide supports defining custom strategies that can be included alongside built-in strategies in your strategy array. This approach provides a cleaner way to encapsulate custom locale resolution logic.

Custom strategies must follow the naming pattern custom-<name> where <name> can contain any characters (including hyphens, underscores, etc.).

They can be defined in both client- and server-side environments, enabling you to develop reusable locale resolution logic that integrates seamlessly with Paraglide's runtime. Use the defineCustomClientStrategy() and defineCustomServerStrategy() functions to write strategies for each environment. Follow the examples below to define your own custom strategies.

To use them, you need to include them in the strategy array when configuring your project.

compile({
	project: "./project.inlang",
	outdir: "./src/paraglide",
+	strategy: ["custom-userPreferences", "cookie", "baseLocale"]
})
Client-side custom strategies
Define a custom strategy for client-side locale resolution using defineCustomClientStrategy(). The handler must implement both getLocale() and setLocale() methods.

When to use: Use client-side custom strategies when you need to read/write locale from sources that are only available in the browser (like query parameters, sessionStorage, URL hash, etc.).

Where to call: Define your custom strategies in your app's initialization code, before the runtime starts using them. For framework apps, this is typically in your main app file, a layout component, or a plugin/middleware setup.

import { defineCustomClientStrategy } from "./paraglide/runtime.js";

// Example 1: sessionStorage strategy
defineCustomClientStrategy("custom-sessionStorage", {
	getLocale: () => {
		return sessionStorage.getItem("user-locale") ?? undefined;
	},
	setLocale: (locale) => {
		sessionStorage.setItem("user-locale", locale);
	},
});

// Example 2: Query parameter strategy (answers the original question!)
defineCustomClientStrategy("custom-queryParam", {
	getLocale: () => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("locale") ?? undefined;
	},
	setLocale: (locale) => {
		const url = new URL(window.location);
		url.searchParams.set("locale", locale);
		window.history.replaceState({}, "", url.toString());
	},
});

// Example 3: URL hash strategy
defineCustomClientStrategy("custom-hash", {
	getLocale: () => {
		const hash = window.location.hash.slice(1); // Remove #
		return hash.startsWith("lang=") ? hash.replace("lang=", "") : undefined;
	},
	setLocale: (locale) => {
		window.location.hash = `lang=${locale}`;
	},
});
Server-side custom strategies
For server-side custom strategies, use defineCustomServerStrategy(). The handler only needs to implement a getLocale() method that accepts an optional Request parameter.

When to use: Use server-side custom strategies when you need to read locale from server-specific sources (like custom headers, databases, authentication systems, etc.).

Where to call: Define your custom strategies in your server initialization code, before the middleware starts processing requests. For framework apps, this is typically in your server setup file or middleware configuration.

Async support: Server-side custom strategies support async operations! If your getLocale method returns a Promise, the system will automatically use the async locale extraction path.

import { defineCustomServerStrategy } from "./paraglide/runtime.js";

// Example 1: Custom header strategy
defineCustomServerStrategy("custom-header", {
	getLocale: (request) => {
		const locale = request?.headers.get("X-Custom-Locale");
		return locale ?? undefined;
	},
});

// Example 2: Async database strategy
defineCustomServerStrategy("custom-database", {
	getLocale: async (request) => {
		const userId = extractUserIdFromRequest(request);
		if (!userId) return undefined;

		try {
			// This async call is supported!
			return await getUserLocaleFromDatabase(userId);
		} catch (error) {
			console.warn("Failed to fetch user locale:", error);
			return undefined;
		}
	},
});

// Example 3: Query parameter on server (for SSR)
defineCustomServerStrategy("custom-serverQuery", {
	getLocale: (request) => {
		const url = new URL(request.url);
		return url.searchParams.get("locale") ?? undefined;
	},
});
Advanced example: Full-stack user preference strategy
Here's a complete example showing how to implement user preference strategies on both client and server, with async database support:

// File: src/locale-strategies.js
import {
	defineCustomClientStrategy,
	defineCustomServerStrategy,
} from "./paraglide/runtime.js";
import {
	getUserLocale,
	setUserLocale,
	extractUserIdFromRequest,
} from "./services/userService.js";

// Client-side strategy - works with user preferences in browser
defineCustomClientStrategy("custom-userPreference", {
	getLocale: () => {
		// Get from memory cache, framework state store, or return undefined to fall back
		return window.__userLocale ?? undefined;
	},
	setLocale: async (locale) => {
		try {
			// Update user preference in database via API
			await setUserLocale(locale);
			window.__userLocale = locale;

			// Optional: Also update URL query param for immediate reflection
			const url = new URL(window.location);
			url.searchParams.set("locale", locale);
			window.history.replaceState({}, "", url.toString());
		} catch (error) {
			console.warn("Failed to save user locale preference:", error);
			// Strategy can still succeed even if save fails
		}
	},
});

// Server-side strategy - async database lookup
defineCustomServerStrategy("custom-userPreference", {
	getLocale: async (request) => {
		const userId = extractUserIdFromRequest(request);
		if (!userId) return undefined;

		try {
			// Async database call - this is now fully supported!
			return await getUserLocale(userId);
		} catch (error) {
			console.warn("Failed to fetch user locale from database:", error);
			return undefined; // Fallback to next strategy
		}
	},
});
Custom strategy benefits
Custom strategies offer several advantages over the traditional overwriteGetLocale() approach:

Composability: They can be combined with built-in strategies in a single strategy array
Priority handling: They respect the strategy order, allowing fallbacks to other strategies
Framework integration: Easier to package and distribute with framework adapters
Type safety: Better TypeScript support for custom strategy handlers
Error isolation: If a custom strategy fails, execution continues with the next strategy
Async support: Server-side strategies can perform async operations like database queries
Middleware compatibility: Work seamlessly with Paraglide's server middleware
Important Notes
Async Support:

✅ Server-side strategies support async getLocale methods
❌ Client-side strategies must have synchronous getLocale methods (but setLocale can be async)
✅ When any custom strategy uses async setLocale, the main setLocale() function becomes async and page reloads wait for all async operations to complete
If you need async client-side locale detection, use the overwriteGetLocale() approach instead
Strategy Priority:

Custom strategies are processed in the order they appear in your strategy array
If a custom strategy returns undefined, the system falls back to the next strategy
Server-side: Custom strategies are checked first, then built-in strategies
Client-side: All strategies (custom and built-in) are processed in your defined order
Validation: Custom strategy names must start with custom- followed by at least one character. The name part after custom- can contain any characters including hyphens, underscores, etc.

Valid examples:

custom-sessionStorage
custom-user-preference
custom-query_param
custom-database
Invalid examples:

custom- (no name after prefix)
my-custom-strategy (doesn't start with custom-)
sessionStorage (missing custom- prefix)

Server Side Rendering (SSR) / Static Site Generation (SSG)
Paraglide JS provides first-class support for server-side rendering (SSR) and static site generation (SSG) through the paraglideMiddleware().

If you just want to use Paraglide JS on the server, in CLI apps, etc, without SSR/SSG, refer to the vanilla JS/TS docs.
Using paraglideMiddleware()
The paraglideMiddleware() handles request-scoped locale management automatically:

import { paraglideMiddleware } from './paraglide/server.js';

app.get("*", async (request) => {
  return paraglideMiddleware(request, async ({ request, locale }) => {
    // Your request handling logic here
    return Response(html(request));
  });
});
Key features:

Automatically manages async local storage context
Handles URL localization/delocalization
Ensures locale state isolation between requests
Automatic re-directs
The paraglideMiddleware() automatically re-directs requests to the appropriate localized URL.

For example, assume that the cookie strategy preceeds the url strategy. If a request from a client is made where the client's locale cookie is set to de, the paraglideMiddleware() will re-direct the request from https://example.com/page to https://example.com/de/seite.

await compile({
  project: "./project.inlang",
  outdir: "./src/paraglide",
+  strategy: ['cookie', 'url'],
})
If the automatic redirects are not desired, you can increase the precedence of the url strategy:

await compile({
  project: "./project.inlang",
  outdir: "./src/paraglide",
-  strategy: ['cookie', 'url'],
+  strategy: ['url', 'cookie'],
})


Client routers can reuse the same redirect logic via `shouldRedirect()`. See the [`url` strategy guide](./strategy.md#client-side-redirects) for an example.
Disabling Async Local Storage
You can use disableAsyncLocalStorage: true to disable the use of Node.js' AsyncLocalStorage. This is only safe in environments that do not share request context between concurrent requests.

Examples of safe environments:

Cloudflare Workers
Vercel Edge Functions
AWS Lambda (single-request mode)
Other isolated runtime contexts
paraglideVitePlugin({
  // ...
  disableAsyncLocalStorage: true // ⚠️ Use with caution
})
Best Practices
Always enable AsyncLocalStorage for:

Traditional Node.js servers
Docker containers handling multiple requests
Any environment with request pooling
Test isolation by making parallel requests:

// Test that locale doesn't leak between requests
await Promise.all([
  fetch('/fr/about'),
  fetch('/de/contact')
])
Monitor for these warning signs:

Random locale switches during load testing
Incorrect URL origins in logs
Session data appearing in wrong requests
Serverless Environments
For edge functions and serverless platforms, you can use per-request overrides because each request is isolated:

// Cloudflare Worker example
export default {
  async fetch(request: Request) {
    // Determine locale from request
    const locale = getLocaleFromURL(request.url);
    
    // Override per-request
    overwriteGetLocale(() => locale);
    overwriteGetUrlOrigin(() => new URL(request.url).origin);

    return handleRequest(request);
  }
};

// Next.js Edge Middleware
import { NextResponse } from 'next/server';

export function middleware(request) {
  const locale = getLocaleFromCookie(request);
  
  overwriteGetLocale(() => locale);
  overwriteGetUrlOrigin(() => request.nextUrl.origin);

  return NextResponse.next();
}
Server Side Rendering (SSR)
Setting up the paraglideMiddleware() automatically enables server-side rendering (SSR) for your application.

Static Site Generation (SSG)
Your framework of choice (e.g. Next.js, SvelteKit, etc.) needs to know the localized URLs of your pages to generate them during build time.

https://example.com/about
+https://example.com/de/about
+https://example.com/fr/about
Several possibilities exist to communicate these URLs to your framework:

Site crawling (invisible anchor tags)
Some static site generators crawl your site during build time by following anchor tags to discover all pages. You can leverage this behavior to ensure all localized URLs of your pages are generated:

Add invisible anchor tags in the root layout of your application for each locale
Ensure the paraglideMiddleware() is called
You can adapt the example beneath to any other framework

import { locales, localizeHref } from "./paraglide/runtime.js";

// in the root layout
function Layout({ children }) {
  return (
    <div>{children}</div>
    // add invisible anchor tags for the currently visible page in each locale
    <div style="display: none">
      {locales.map((locale) => (
        <a href={localizeHref(`/about`, { locale })}></a>
      ))}
    </div>
  )
}
The rendered HTML of the page will include the invisible anchor tags, ensuring they are generated during build time. The framwork will crawl the HTML and follow the anchor tags to discover all pages.

<div>
  <p>My Cool Website
</div>
+<div style="display: none">
+  <a href="/de/about"></a>
+  <a href="/fr/about"></a>
+</div>
Programmatic Discovery
If invisible anchor tags are not an option, some frameworks provide APIs to discover the localized URLs during build time. Figure out which API your framework provides and adapt the example above accordingly.

Next.js has generateStaticParams() API to discover all localized URLs.
Astro has getStaticPaths()
Troubleshooting
getLocale() returns a different locale than expected
This can happen if getLocale() is called outside of the scope of paraglideMiddleware().

The paraglideMiddleware() ensures that the locale is set correctly for each request. If you call getLocale() outside of the scope of paraglideMiddleware(), you will get the locale of the server which is not the expected locale.

app.get("*", async (request) => {
  // ❌ don't call `getLocale()` outside of `paraglideMiddleware`
  const locale = getLocale()
  
  return paraglideMiddleware(request, async ({ request, locale }) => {
    // ✅ call `getLocale()` inside of `paraglideMiddleware`
    const locale = getLocale()
    
    // Your request handling logic here
    return Response(html(request));
  });
});