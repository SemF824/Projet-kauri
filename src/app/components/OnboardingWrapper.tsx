import { useNavigate } from 'react-router';
import { OnboardingScreen } from './lyann/OnboardingScreen';

export function OnboardingWrapper() {
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem('lyann_authenticated', 'true');
    navigate('/dashboard');
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}
