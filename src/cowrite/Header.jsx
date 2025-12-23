import React, { useState } from "react";
import {
  VeltPresence,
  VeltCommentTool,
  VeltSidebarButton,
} from "@veltdev/react";
import { MOCK_USERS } from "./mockUsers";

export const Header = ({ currentUser, onUserSwitch, veltReady }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleUserSwitch = (user) => {
    onUserSwitch(user);
    setShowUserMenu(false);
  };

  return (
    <div className="cowrite-header">
      <div className="header-left">
        <h1 className="cowrite-logo">Cowrite</h1>
      </div>

      <div className="header-right">
        {/* User Switcher */}
        <div className="user-switcher">
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Switch User"
          >
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              className="user-avatar"
            />
            <span className="user-name">{currentUser.name}</span>
            <svg
              className="dropdown-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
            </svg>
          </button>

          {showUserMenu && (
            <>
              <div
                className="user-menu-backdrop"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="user-menu">
                <div className="user-menu-header">Switch User</div>
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.userId}
                    className={`user-menu-item ${
                      user.userId === currentUser.userId ? "active" : ""
                    }`}
                    onClick={() => handleUserSwitch(user)}
                  >
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="user-avatar-small"
                    />
                    <div className="user-info">
                      <div className="user-info-name">{user.name}</div>
                      <div className="user-info-email">{user.email}</div>
                    </div>
                    {user.userId === currentUser.userId && (
                      <span className="active-badge">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Velt Comment Tool */}
        {veltReady && (
          <div className="velt-tool">
            <VeltCommentTool />
          </div>
        )}

        {/* Velt Sidebar Button */}
        {veltReady && (
          <div className="velt-tool">
            <VeltSidebarButton />
          </div>
        )}

        {/* Velt Presence (Active Users) */}
        {veltReady && (
          <div className="velt-presence">
            <VeltPresence />
          </div>
        )}
      </div>
    </div>
  );
};
