const { ethers } = require("hardhat");

async function main() {
	const WhiteListFactory = await ethers.getContractFactory("WhiteList");
	const whiteListContract = await WhiteListFactory.deploy(20);
	await whiteListContract.deployed();

	console.log("WhiteList COntract deployed to:", whiteListContract.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
