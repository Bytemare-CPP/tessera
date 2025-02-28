import { useSpring, animated } from '@react-spring/web';

function Tessera() {
  const styles = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {['T', 'e', 's', 's', 'e', 'r', 'a'].map((letter, index) => (
        <animated.span
          key={index}
          style={{
            ...styles,
            transitionDelay: `${index * 100}ms`,
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 5px',
            color: '#8EB486',
          }}
        >
          {letter}
        </animated.span>
      ))}
    </div>
  );
}

export default Tessera;