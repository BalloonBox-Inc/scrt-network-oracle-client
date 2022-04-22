import CardWithIcons from './CardsWithIcons';

export default function WhySection() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-4xl font-extrabold mb-20">
        Why{' '}
        <span className="text-transparent bg-gradient-to-b from-purple to-deepblue bg-clip-text">
          SCRTsibyl?
        </span>
      </h2>

      <div className="flex flex-col lg:flex-row md:mt-0">
        <CardWithIcons
          title="Secure &#38; Private"
          img="./images/lock-icon.svg"
          description="
        The Secret Network improves upon traditional smart contracts by supporting encrypted inputs, encrypted outputs, and encrypted state for smart contracts."
        />
        <CardWithIcons
          title="Blockchain Centric"
          img="./images/blockchain-outline.svg"
          description="Outside of your browser's cache &amp; the SCRT Blockchain, there's no 3rd party database storing any of your data, securing you as its rightful owner."
        />
        <CardWithIcons
          title="Open Source"
          img="./images/opensource.svg"
          description="We beleive in full transparency and giving back to the community, which is why SCRTSibyl is entirely open source."
        />
      </div>
    </div>
  );
}
