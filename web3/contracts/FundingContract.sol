// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RewardToken.sol";
import "./ProjectDAO.sol";

contract FundingContract is Ownable {
    struct Project {
        string name;
        string description;
        address payable creator;
        uint256 fundingGoal;
        uint256 currentFunding;
        uint256 deadline;
        bool funded;
        bool exists;
    }

    struct Contribution {
        uint256 amount;
        uint256 timestamp;
    }

    RewardToken public rewardToken;
    ProjectDAO public projectDAO;
    
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => Contribution[])) public contributions;
    mapping(uint256 => address[]) public projectContributors;
    
    uint256 public nextProjectId;
    uint256 public constant MIN_FUNDING_GOAL = 0.1 ether;
    uint256 public constant MAX_FUNDING_PERIOD = 30 days;
    uint256 public constant TOKEN_REWARD_RATE = 100; // tokens per ETH contributed
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed creator,
        uint256 fundingGoal,
        uint256 deadline
    );
    
    event ContributionMade(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount,
        uint256 timestamp
    );
    
    event ProjectFunded(uint256 indexed projectId, uint256 totalAmount);
    event FundsWithdrawn(uint256 indexed projectId, address indexed creator, uint256 amount);
    
    constructor(address _rewardToken, address _projectDAO) {
        rewardToken = RewardToken(_rewardToken);
        projectDAO = ProjectDAO(payable(_projectDAO));
    }
    
    function createProject(
        string memory _name,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _duration
    ) external returns (uint256) {
        require(_fundingGoal >= MIN_FUNDING_GOAL, "Funding goal too low");
        require(_duration <= MAX_FUNDING_PERIOD, "Duration too long");
        
        uint256 projectId = nextProjectId++;
        uint256 deadline = block.timestamp + _duration;
        
        projects[projectId] = Project({
            name: _name,
            description: _description,
            creator: payable(msg.sender),
            fundingGoal: _fundingGoal,
            currentFunding: 0,
            deadline: deadline,
            funded: false,
            exists: true
        });
        
        emit ProjectCreated(projectId, _name, msg.sender, _fundingGoal, deadline);
        return projectId;
    }
    
    function contribute(uint256 _projectId) external payable {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(block.timestamp < project.deadline, "Project funding period ended");
        require(msg.value > 0, "Contribution must be greater than 0");
        
        project.currentFunding += msg.value;
        
        // Record contribution
        contributions[_projectId][msg.sender].push(Contribution({
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Add to contributors list if first contribution
        if (contributions[_projectId][msg.sender].length == 1) {
            projectContributors[_projectId].push(msg.sender);
        }
        
        // Mint reward tokens
        uint256 tokenReward = (msg.value * TOKEN_REWARD_RATE) / 1 ether;
        rewardToken.mint(msg.sender, tokenReward);
        
        emit ContributionMade(_projectId, msg.sender, msg.value, block.timestamp);
        
        // Check if project is fully funded
        if (project.currentFunding >= project.fundingGoal) {
            project.funded = true;
            emit ProjectFunded(_projectId, project.currentFunding);
        }
    }
    
    function createProposal(uint256 _projectId, string memory _description) external {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(project.funded, "Project not funded");
        
        uint256 proposalId = projectDAO.createProjectProposal(
            _projectId,
            _description,
            ProjectDAO.ProposalCategory.GENERAL
        );
        
        require(proposalId > 0, "Failed to create proposal");
    }
    
    function getProjectVotes(uint256 _projectId) external view returns (
        uint256 againstVotes,
        uint256 forVotes,
        uint256 abstainVotes
    ) {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        
        uint256 proposalId = projectDAO.getProjectProposal(_projectId);
        require(proposalId > 0, "No proposal exists for project");
        
        return (0, 0, 0); // Placeholder - implement actual vote counting
    }
    
    function withdrawFunds(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(project.funded, "Project not funded");
        require(msg.sender == project.creator, "Only creator can withdraw");
        
        uint256 amount = project.currentFunding;
        project.currentFunding = 0;
        
        payable(project.creator).transfer(amount);
        emit FundsWithdrawn(_projectId, msg.sender, amount);
    }
    
    function getProject(uint256 _projectId) external view returns (
        string memory name,
        string memory description,
        address creator,
        uint256 fundingGoal,
        uint256 currentFunding,
        uint256 deadline,
        bool funded,
        bool exists
    ) {
        Project storage project = projects[_projectId];
        return (
            project.name,
            project.description,
            project.creator,
            project.fundingGoal,
            project.currentFunding,
            project.deadline,
            project.funded,
            project.exists
        );
    }
    
    function getContributors(uint256 _projectId) external view returns (address[] memory) {
        return projectContributors[_projectId];
    }
    
    function getContributions(uint256 _projectId, address _contributor) external view returns (Contribution[] memory) {
        return contributions[_projectId][_contributor];
    }
}