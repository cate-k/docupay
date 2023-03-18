# DocuPay

### What is DocuPay?
DocuPay is a DApp backed by a smart contract where users can quickly share PDF files on informational products or reports, and get paid in Ethereum when someone purchases their file to download.

### Technology
DocuPay was built using Solidity, ReactJS, Truffle, Ganache, and Infura. Its smart contract is deployed on the Sepolia testnet on the Ethereum blockchain and can be found on [Etherscan](https://sepolia.etherscan.io/address/0xA1AE9A5EBfb5614e527559dCFA06D6602CB40b25).

### Note
This project was completed in February 2022, but it was originally on the Ropsten and Goerli testnets. Due to those testnets closing, DocuPay moved to Sepolia in March 2023.

### How It Works
**1.** On the home page, the user can connect their MetaMask wallet to DocuPay. For new users, an account is automatically created using their wallet's public address once the "Sign in" button is clicked.

![1 - Home](https://user-images.githubusercontent.com/37799039/207043095-032a35b5-ae10-4b19-88cd-568e4942998f.PNG)

**2.** The user can upload PDF files and add a title, fee (in gwei), and description. Once the "Publish" button is clicked, a MetaMask transaction will appear for the user to confirm.

![2A - Upload Document](https://user-images.githubusercontent.com/37799039/207043814-0a564425-80a5-493c-8d2d-dcbe47f2c279.PNG)

![2B - Upload Document](https://user-images.githubusercontent.com/37799039/207043930-10ba4d4d-8e80-49ee-94ba-99218d738ea8.PNG)

**3.** All posts can be viewed on the feed page, and they can be favourited by clicking the star icon on the left-hand side of the post.

![3 - Feed](https://user-images.githubusercontent.com/37799039/207057668-0fdcf31c-8c70-4277-9206-1fdc8afe9122.PNG)

**4.** Once the user has clicked on a document to view, they may upvote, downvote, favourite, and comment on it. Comments can be deleted, and they can be liked by other users. Under the comment message is also a status that shows if the commenter has purchased the document or not.

![4A - Document](https://user-images.githubusercontent.com/37799039/207068251-b4c1af44-cf46-4c6a-9f0d-cdcdb9386cb6.PNG)

![4B - Document](https://user-images.githubusercontent.com/37799039/207068404-d84e7135-b53c-49b8-a726-ab42d8844e82.PNG)

Clicking on the "Purchase document" button triggers two MetaMask transactions. The transactions add the document to the user's library and send the fee to the uploader.

![4C - Document](https://user-images.githubusercontent.com/37799039/207068426-3f1eb8b8-de38-4b1c-a670-be3902213faf.PNG)

After the transactions have been confirmed, the "Purchase document" button will change to "Download document." This allows the user to directly download the PDF file.

![4D - Document](https://user-images.githubusercontent.com/37799039/207068441-729177d5-90a9-4a37-b101-fe365c4f566e.PNG)

The status on comments sent previously also changes if the commenter purchases the document.

![4E - Document](https://user-images.githubusercontent.com/37799039/207068456-a86d6832-ab53-4614-b08c-37f8c110cae2.PNG)

**5.** In the library, the user can view documents they have favourited and purchased. Purchased documents have an eye icon on the "View document" button to let the user see which documents they already have at a glance.

![5 - Library](https://user-images.githubusercontent.com/37799039/207071502-f59cd3fa-7751-4d87-ae7c-bbf93173e2e9.PNG)

**6.** The profile page contains information such as the user's public address, display name, reputation, and documents they have uploaded. On the user's own profile, they may edit their display name.

![6 - Profile](https://user-images.githubusercontent.com/37799039/207071529-74356405-ca7f-4830-83a8-d5275f62de09.PNG)
