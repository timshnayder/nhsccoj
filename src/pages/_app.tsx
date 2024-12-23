import '@/styles/globals.css';
import '@/styles/Navbar.css';
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app';
import Head from "next/head";
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Head>
				<title>NHSCC:OJ</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.png' />
				<meta
					name='description'
					content='NHS Coding Club Judge'
				/>
			</Head>
			<ToastContainer/>
			<Component {...pageProps} />
			
		</RecoilRoot>
	);
}
