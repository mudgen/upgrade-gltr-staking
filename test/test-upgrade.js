const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { deployUpgrade} = require("../scripts/upgrade.js")

// ERC20 addresses
const FUD_ADDRESS = "0x403E967b044d4Be25170310157cB1A4Bf10bdD0f";
const FUD_BANK = "0x1d0360bac7299c86ec8e99d0c1c9a95fefaf2a11"
const FOMO_ADDRESS = "0x44A6e0BE76e1D9620A7F76588e4509fE4fa8E8C8";
const ALPHA_ADDRESS = "0x6a3E7C3c6EF65Ee26975b12293cA1AAD7e1dAeD2";
const KEK_ADDRESS = "0x42E5E06EF5b90Fe15F853F59299Fc96259209c5C";




describe("test-upgrade", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const { stakingDiamondAddress } = await deployUpgrade();
    const stakingFacet = await ethers.getContractAt("StakingFacet", stakingDiamondAddress)
    const stakingTokenFacet = await ethers.getContractAt("StakingTokenFacet", stakingDiamondAddress)
    const farmFacet = await ethers.getContractAt("FarmFacet", stakingDiamondAddress)
    const [owner, addr1, addr2] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress()
    const FUD = await ethers.getContractAt("IERC20", FUD_ADDRESS)
    const fudBank = await ethers.getImpersonatedSigner(FUD_BANK)
    await FUD.connect(fudBank).transfer(ownerAddress, ethers.parseEther("10000.0"))
    //const balance = await FUD.balanceOf(ownerAddress)    
    console.log("Setup finished")

    
    
    return { stakingFacet, stakingTokenFacet, farmFacet };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      

      const { stakingFacet, stakingTokenFacet, farmFacet } = await loadFixture(deployFixture);
      

      // console.log(stakingFacet)
      const totalPending = await farmFacet.totalPending()

      console.log(totalPending)

      // expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.target)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
