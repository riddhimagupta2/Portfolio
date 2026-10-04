import React from 'react';

const TechStack = ({ uptimePill = "99.9% Uptime", stackLine = "Flutter • Django REST API • PostgreSQL • Docker & cloud" }) => {
  const items = stackLine.split('•').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="font-mono text-[10px] sm:text-[10.5px] text-white/75 tracking-[0.08em] flex flex-wrap items-center gap-1.5 sm:gap-2 select-none">
      {/* Red Outlined Uptime Pill */}
      {uptimePill && (
        <span className="px-2 py-0.5 rounded border border-[#E50914]/60 bg-[#E50914]/10 text-[#E50914] font-mono text-[9px] sm:text-[9.5px] font-bold shadow-[0_0_8px_rgba(229,9,20,0.25)]">
          {uptimePill}
        </span>
      )}

      {items.map((item, idx) => {
        const isRed = /flutter|django/i.test(item);

        return (
          <React.Fragment key={idx}>
            <span className="text-white/25 text-[7px] sm:text-[8px]">●</span>
            <span
              className={
                isRed
                  ? "text-[#E50914] font-bold drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                  : "text-white/75 font-normal"
              }
            >
              {item}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TechStack;
