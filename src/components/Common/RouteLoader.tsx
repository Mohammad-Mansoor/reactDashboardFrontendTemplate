export default function RouteLoader({ show }) {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 dark:bg-gray-900/70'>
      <div className='route-loader'>
        <img
          src='/images/logo/Qalam-logo.png'
          alt='Loading'
          className='route-loader__logo'
        />
        <div className='route-loader__bar' />
      </div>
    </div>
  );
}
