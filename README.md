# native-sso-app

<p align="center">
	<a href="https://github.com/RichardLitt/standard-readme">
		<img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square" alt="standard-readme compliant">
	</a>
	<a href="#contributors">
		<img src="https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square" alt="standard-readme compliant">
	</a>
	<a href="#license">
		<img alt="GitHub" src="https://img.shields.io/github/license/okta-ciam-specialists/native-sso">
	</a>
	<a href="https://wakatime.com/badge/user/28857d2c-0688-4cac-b02c-d81ceead7b94/project/337025aa-aed0-4870-bdd2-076ba976fa3b">
		<img src="https://wakatime.com/badge/user/28857d2c-0688-4cac-b02c-d81ceead7b94/project/337025aa-aed0-4870-bdd2-076ba976fa3b.svg" alt="wakatime">
	</a>
</p>
<br/>
<p align="center">
	<img alt="GitHub followers" src="https://img.shields.io/github/followers/okta-ciam-specialists?style=social">
	<img alt="GitHub forks" src="https://img.shields.io/github/forks/okta-ciam-specialists/native-sso?style=social">
</p>
<br/>
<p align="center">
	<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fokta-ciam-specialists%2Fnative-sso"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
	<a href="https://stackblitz.com/fork/github/okta-ciam-specialists/native-sso.git">
	<img
		alt="Open in StackBlitz"
		src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
	/>
	</a>
</p>

A simple React SPA (powered by [Vite](https://vitejs.dev)) that represents a &#34;native&#34; application in order to initiate an OAuth compliant Native SSO to a secondary application.

TODO: Fill out this long description.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

## Install

```bash
npm install
```

### Configuration

By default, this project utilizes an existing Okta tenant. For local development, `http://localhost:3000` & `http://localhost:3000/login/callback` are allowed URLs.

You will need to spin up and use your own tenant if you need to use different redirect URLs or want to modify the configuration.

Follow the steps necessary to setup your application [here](https://developer.okta.com/docs/guides/configure-native-sso/main/#native-sso-flow).

Update the `.env` file with the appropriate values:

```env
VITE_OKTA_CLIENT_ID=
VITE_OKTA_ISSUER=
```

## Usage

### Running Locally

```bash
npm run dev
```

### Deploying

This application was initially deployed using Vercel. To deploy to your own instance, use the 'Deploy' button at the top of the page and follow Vercel's guide(s).

## Maintainers

[@eatplaysleep](https://github.com/eatplaysleep)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/krishvenkatraman-okta-zz"><img src="https://avatars.githubusercontent.com/u/14205843?v=4?s=100" width="100px;" style="border-radius:50%" alt="Krish Venkatraman"/><br /><sub><b>Krish Venkatraman</b></sub></a><br /><a href="https://github.com/eatplaysleep/native-sso-app/commits?author=krishvenkatraman-okta-zz" title="Ideas">🤔</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT © 2023 Danny Fuhriman
