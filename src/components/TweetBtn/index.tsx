interface ITweetBtn {
  message: string;
}

const TweetBtn = ({ message }: ITweetBtn) => {
  return (
    <div className="z-20 flex flex-col justify-center items-center mt-10">
      Share it on Twitter
      <div className="bg-white flex justify-center rounded-full py-3 px-2.5 mt-4 cursor-pointer hover:bg-gray-300">
        <a
          href={`https://twitter.com/intent/tweet?text=${message}`}
          target="_blank"
          rel="noreferrer"
        >
          <img src="../images/twitter-icon.svg" alt="twitter-icon" />
        </a>
      </div>
    </div>
  );
};

export default TweetBtn;
