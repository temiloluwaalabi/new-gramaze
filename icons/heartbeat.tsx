export default function HeartbeatIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={props.className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2_776)">
        <path
          d="M3 12.75H6.75L8.25 10.5L11.25 15L12.75 12.75H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.25 9.75C2.25 9.68719 2.25 9.62531 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21C12 21 8.0625 18.8813 5.19562 15.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_776">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
