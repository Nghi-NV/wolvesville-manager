# Werewolf Game Manager (Quản Trò Ma Sói)

A comprehensive web application designed to assist Game Masters (GMs) in managing Werewolf (Ma Sói) game sessions. Built with Next.js, Tailwind CSS, and Zustand.

## Features

### 🎮 Game Setup
- **Flexible Player Management**: Add, remove, and manage players with names and optional avatars.
- **Role Selection**: Choose from a variety of roles including Villager, Werewolf, Seer, Bodyguard, Cupid, Witch, Hunter, and more.
- **Customizable Role Pool**: Manually select roles for the game session.

### 🌙 Game Session Management
- **Manual Role Assignment**: The GM manually assigns roles to players during the first night, ensuring a smooth setup.
- **Night Action Tracking**:
  - **Status Effects**: Track status effects like Protected (🛡️), Linked (❤️), Poisoned (☠️), Silenced (👁️), and Targeted (⚡).
  - **Logic Enforcement**: Automatically enforces game rules (e.g., Bodyguard protects only 1 person, Cupid links only 2 people).
  - **Kill/Revive**: Easily mark players as dead or revive them.
- **Day/Night Cycle**: Seamlessly switch between Day and Night phases with round tracking.
- **Alive/Dead Filtering**: Automatically filter the player list to show "Alive" or "Dead" players, preventing clutter.

### 🛠️ GM Tools
- **Search**: Quickly find players by name.
- **Role Details**: View detailed descriptions of each role.
- **End Game**: Easily end the game and record the winning team (Villagers, Werewolves, or Third Party).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nghi-NV/wolvesville-manager.git
   cd wolvesville-manager
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is configured for static export and can be easily deployed to GitHub Pages.

### GitHub Pages

The project includes a GitHub Action workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the application to GitHub Pages on every push to the `main` branch.

To enable this:
1. Go to your repository **Settings**.
2. Navigate to **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.

## License

This project is licensed under the MIT License.
