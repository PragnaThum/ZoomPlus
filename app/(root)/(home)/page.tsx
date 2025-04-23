import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(
    now,
  );

  return (
    <section className="min-h-screen flex flex-col items-center gap-10 text-white px-5">
      {/* Time & Date Section */}
      <div className="w-full max-w-4xl rounded-[20px] bg-cover p-5">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
          <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
        </div>
      </div>

      {/* MeetingTypeList section */}
      <MeetingTypeList />
    </section>
  );
};

export default Home;
