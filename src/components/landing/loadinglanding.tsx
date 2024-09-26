export const LoadingLanding = () => {
    return (
      <div className="w-screen h-screen flex items-start justify-start p-10 bg-background-dark text-on-background-dark">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'clash' }}>
          <span>Starting </span>
          <span style={{
            background: 'linear-gradient(to right, #8dcff1, #c8c2ea, #c8c2ea)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'gradient 1s ease infinite'
          }}>WpsUI</span>
          <span className="blink-caret"> _</span>
        </h1>
        <style>
          {`
            @keyframes gradient {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
  
            @keyframes blink-caret {
              from, to {
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
            }
  
            .blink-caret {
              animation: blink-caret 0.8s step-end infinite;
            }
          `}
        </style>
      </div>
    );
  };