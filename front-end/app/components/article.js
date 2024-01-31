import React from 'react';

function Article({ title, description, status }) {
  // Define styles based on the status
  const borderColors = {
    'En discusión': '#838383',
    'Vigente': '#74ACDF',
    'No Vigente': '#DF7474',
    // Add more status-color mappings as needed
  };

  const textColors = {
    'En discusión': '#838383',
    'Vigente': '#74ACDF',
    'No Vigente': '#DF7474',
    // Add more status-color mappings as needed
  };
  
  // Retrieve border color and text color based on the status
  const borderColor = borderColors[status] || '#DF7474';
  const textColor = textColors[status] || '#DF7474';

  // Calculate title font size based on description presence
  const titleClamp = description ? '3' : '5';

  return (
    <div className="flex flex-col bg-white p-[1.4rem] gap-4 border-[2px] rounded-[5px]" style={{ borderColor: borderColor, height: '30vh' }}>
      <span className={`font-bold text-[1.35rem] ${description ? 'line-clamp-2 md:line-clamp-3' : 'line-clamp-5 md:line-clamp-5'}`} style={{ color: textColor }}>
        {title}
      </span>
      {description && (
        <span className="font-medium text-[#38485C] text-[0.95rem] overflow-hidden">
          <span className="line-clamp-2 md:line-clamp-6 ">
            {description}
          </span>
        </span>
      )}
      {/* <span className="font-medium text-[#38485C] text-[0.95rem] underline">Leer más</span> */}
    </div>
  );
}

export default Article;