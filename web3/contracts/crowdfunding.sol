// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        uint256 id; // Store the campaign ID explicitly
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0; 

    // Event for campaign creation
    event CampaignCreated(uint256 campaignId, address owner, string title, uint256 target, uint256 deadline);

    // Event for donations
    event Donated(uint256 campaignId, address donator, uint256 amount);

    // New structs for platform donations and fund requests
    struct PlatformDonation {
        uint256 id;
        string donorId;  // Changed from address to string
        string donorName;
        uint256 amount;
        uint256 timestamp;
    }

    struct donatedtoNGO {
        uint256 id;
        string ngoId;
        string ngoName;
        uint256 amount;
        uint256 timestamp;
    }

    // New mappings and counters
    mapping(uint256 => PlatformDonation) public platformDonations;
    mapping(uint256 => donatedtoNGO) public donatedToNGOs;
    uint256 public numberOfPlatformDonations = 0;
    uint256 public numberOfFundRequests = 0;

    // New events
    event PlatformDonated(uint256 donationId, string donor, string donorName, uint256 amount);
    event FundRequested(uint256 requestId, string ngo, string ngoName, uint256 amount);

    function createCampaign(string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.id = numberOfCampaigns;  // Set the ID for the campaign
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        emit CampaignCreated(numberOfCampaigns, msg.sender, _title, _target, _deadline);

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "Campaign has ended.");
        require(campaign.amountCollected < campaign.target, "Target amount already reached.");
        require(amount > 0, "Donation amount should be greater than zero.");

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to send HBAR");

        campaign.amountCollected += amount;

        emit Donated(_id, msg.sender, amount);
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }

    function getCampaign(uint256 _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }

    function getMyCampaigns(address _user) public view returns (Campaign[] memory) {
        uint256 myCampaignCount = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) {
                myCampaignCount++;
            }
        }

        Campaign[] memory myCampaigns = new Campaign[](myCampaignCount);
        uint256 index = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) {
                myCampaigns[index] = campaigns[i];
                index++;
            }
        }

        return myCampaigns;
    }

    function getMyDonations(address _user) public view returns (uint256[] memory, uint256[] memory) {
        uint256 donationCount = 0;

        // First, count how many donations the user has made
        for (uint i = 0; i < numberOfCampaigns; i++) {
            for (uint j = 0; j < campaigns[i].donators.length; j++) {
                if (campaigns[i].donators[j] == _user) {
                    donationCount++;
                }
            }
        }

        // Create arrays to store campaign IDs and donation amounts
        uint256[] memory campaignIds = new uint256[](donationCount);
        uint256[] memory donations = new uint256[](donationCount);
        uint256 index = 0;

        // Populate the arrays with campaign IDs and donation amounts
        for (uint i = 0; i < numberOfCampaigns; i++) {
            for (uint j = 0; j < campaigns[i].donators.length; j++) {
                if (campaigns[i].donators[j] == _user) {
                    campaignIds[index] = i;
                    donations[index] = campaigns[i].donations[j];
                    index++;
                }
            }
        }

        return (campaignIds, donations);
    }

    // New functions for platform donations
    function donateToPlatform(string memory _donorName, uint256 _amount, string memory _id) public {
        require(_amount > 0, "Donation amount should be greater than zero.");

        PlatformDonation storage donation = platformDonations[numberOfPlatformDonations];
        donation.id = numberOfPlatformDonations;
        donation.donorId = _id;
        donation.donorName = _donorName;
        donation.amount = _amount;
        donation.timestamp = block.timestamp;

        emit PlatformDonated(numberOfPlatformDonations, _id, _donorName, _amount);
        numberOfPlatformDonations++;
    }

    // New functions for fund requests
    function createFundRequest(string memory _ngoId, string memory _ngoName, uint256 _amount) public {
        require(_amount > 0, "Amount should be greater than zero");

        donatedtoNGO storage request = donatedToNGOs[numberOfFundRequests];
        request.id = numberOfFundRequests;
        request.ngoId = _ngoId;
        request.ngoName = _ngoName;
        request.amount = _amount;
        request.timestamp = block.timestamp;

        emit FundRequested(numberOfFundRequests, _ngoId, _ngoName, _amount);
        numberOfFundRequests++;
    }

    // New view functions
    function getPlatformDonations() public view returns (PlatformDonation[] memory) {
        PlatformDonation[] memory allDonations = new PlatformDonation[](numberOfPlatformDonations);
        for (uint i = 0; i < numberOfPlatformDonations; i++) {
            allDonations[i] = platformDonations[i];
        }
        return allDonations;
    }

    function getFundRequests() public view returns (donatedtoNGO[] memory) {
        donatedtoNGO[] memory allRequests = new donatedtoNGO[](numberOfFundRequests);
        for (uint i = 0; i < numberOfFundRequests; i++) {
            allRequests[i] = donatedToNGOs[i];
        }
        return allRequests;
    }
}
