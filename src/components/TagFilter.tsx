import React from "react";
import { clsx } from "clsx";
import "../App.css";

interface Props {
  tags: string[];
  active: string;
  onClick: (tag: string) => void;
}

export const TagFilter: React.FC<Props> = ({ tags, active, onClick }) => {
  return (
    <div className="filter-container">
      {["all", ...tags].map((tag) => (
        <button
          key={tag}
          className={clsx("filter-btn", active === tag && "active")}
          onClick={() => onClick(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
