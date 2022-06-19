import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constant";

export default function Home() {
	const [walletconnected, setWalletConnected] = useState(false);

	const [joinedWhitelist, setJoinedWhitelist] = useState(false);

	const [numberOfWhiteListed, setNumberOfWhiteListed] = useState(0);

	const [loading, setLoading] = useState(false);

	const web3ModalRef = useRef();

	const addWhiteListAddress = async () => {
		try {
			const signer = await getProviderOrSigner(true);
			const whiteListContract = new Contract(
				WHITELIST_CONTRACT_ADDRESS,
				abi,
				signer
			);

			const txn = await whiteListContract.addAddressToWhiteList();
			setLoading(true);
			await txn.wait();
			setLoading(false);

			await getNumberOfWhiteListed();

			setJoinedWhitelist(true);
		} catch (err) {
			console.error(err);
		}
	};

	const getProviderOrSigner = async (needSigner = false) => {
		try {
			const provider = await web3ModalRef.current.connect();

			const web3Provider = new providers.Web3Provider(provider);

			const { chainId } = await web3Provider.getNetwork();

			if (chainId !== 5) {
				alert("Change the chainId to Goerli");
				throw new Error("Change the network to Goerli");
			}

			if (needSigner) {
				const signer = web3Provider.getSigner();
				return signer;
			}

			return web3Provider;
		} catch (err) {
			console.error(err);
		}
	};

	const checkIfAddressIsWhiteListed = async () => {
		try {
			const signer = await getProviderOrSigner(true);

			const whiteListContract = new Contract(
				WHITELIST_CONTRACT_ADDRESS,
				abi,
				signer
			);

			const address = await signer.getAddress();
			const _joinedWhiteList = await whiteListContract.s_whiteListedAddress(
				address
			);
			// clg
			console.log(_joinedWhiteList);
			setJoinedWhitelist(_joinedWhiteList);
		} catch (err) {
			console.error(err);
		}
	};

	const getNumberOfWhiteListed = async () => {
		try {
			const provider = await getProviderOrSigner();
			const whiteListContract = new Contract(
				WHITELIST_CONTRACT_ADDRESS,
				abi,
				provider
			);

			const _numberOfWhiteListed =
				await whiteListContract.s_numAddressesWhiteListed();
			setNumberOfWhiteListed(_numberOfWhiteListed);
			//clg
			console.log(numberOfWhiteListed);
		} catch (err) {
			console.error(err);
		}
	};

	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
			setWalletConnected(true);
			checkIfAddressIsWhiteListed();
			getNumberOfWhiteListed();
		} catch (err) {
			console.error(err);
		}
	};

	const renderButton = () => {
		if (walletconnected) {
			if (joinedWhitelist) {
				return (
					<div className={styles.description}>
						Thanks for joining the WhiteList
					</div>
				);
			} else if (loading) {
				return <button className={styles.button}>Loading...</button>;
			} else {
				return (
					<button onClick={addWhiteListAddress()} className={styles.button}>
						Join the Whitelist
					</button>
				);
			}
		} else {
			return (
				<button onClick={connectWallet} className={styles.button}>
					Connect your wallet
				</button>
			);
		}
	};
	useEffect(() => {
		if (!walletconnected) {
			web3ModalRef.current = new Web3Modal({
				network: "goerli",
				providerOptions: {},
				disabledInjectedProvider: false,
			});
			connectWallet();
		}
	}, [walletconnected]);

	return (
		<div>
			<Head>
				<title>WhiteList Dapp</title>
				<meta />
			</Head>
			<div className={styles.main}>
				<div>
					<h1 className={styles.title}>Welcome to Crypto Devs</h1>
					<div className={styles.description}>
						{numberOfWhiteListed} have already joined the Whitelist
					</div>
					{renderButton()}
					<div>
						<img src="./crypto-devs.svg" alt="" className={styles.image} />
					</div>
				</div>
			</div>
			<footer className={styles.footer}>
				<div>
					Made with &#10084; by{" "}
					<a href="https://twitter.com/AdilIrshad73">
						{" "}
						<b> Adil Irshad </b>
					</a>
				</div>
			</footer>
		</div>
	);
}
