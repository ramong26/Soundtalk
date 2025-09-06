import Link from 'next/link';
import Image from 'next/image';
import SortDown from '@/shared/components/SortDown';

interface Profile {
  displayName: string;
  profileImageUrl?: string | null;
}

interface HeaderLayoutProps {
  handleOpenModal: (type: 'login' | 'signup') => void;
  handleLogout: () => void;
  profile: Profile | null;
  isLogin: boolean;
}

export default function HeaderLayout({
  handleOpenModal,
  handleLogout,
  profile,
  isLogin,
}: HeaderLayoutProps) {
  // SignIn / SignUp 라벨
  const signInLabel = ['SIGNIN', 'SIGNUP'];
  // 로그인 인증 모달 열기 핸들러
  const handleAuthSelect = (type: string) => {
    if (type === 'SIGNIN') handleOpenModal('login');
    else if (type === 'SIGNUP') handleOpenModal('signup');
  };

  // 메뉴 라벨
  const menuLabel = ['CHART', 'PLAYLIST', 'CHANNEL', 'RECOMMEND'];
  // 메뉴 링크
  const menuLink = ['/charts', '/playlist', '/channel', '/recommend'];

  // 로그인 전 버튼 렌더링
  const renderAuthButtons = () => (
    <div className="lg:text-xl md:text-lg text-sm font-bold flex lg:gap-[30px] md:gap-[15px] gap-[10px] items-center justify-between h-full ">
      <SortDown
        label={signInLabel}
        onSelect={handleAuthSelect}
        title="Login"
        className="lg:left-[-32px] md:left-[-14px] left-[-2px]"
      />
    </div>
  );
  // 로그인 후 프로필 렌더링
  const renderProfile = () =>
    profile && (
      <div className="flex items-center md:gap-2 gap-0.5 lg:text-xl md:text-lg text-sm font-bold  h-full">
        <Link href="/profile" className="flex items-center gap-2">
          {profile.profileImageUrl && (
            <Image
              src={profile.profileImageUrl}
              alt="Profile"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          {profile.displayName}
        </Link>
        <button className="cursor-pointer" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>
    );

  return (
    <div className="lg:px-[30px] md:px-[20px] px-[15px] flex w-full justify-between  h-[70px] bg-white">
      <div className="lg:text-xl md:text-lg text-sm font-bold flex lg:gap-[20px] md:gap-[15px] gap-[10px] items-center justify-between">
        <SortDown label={menuLabel} link={menuLink} title="Menu" dropdownPosition="right-[-60px]" />
      </div>

      <Link href="/" className="lg:text-2xl md:text-lg font-extrabold flex items-center">
        SOUNDTALK
      </Link>
      <div className="h-full">
        <div className="h-full">{isLogin ? renderProfile() : renderAuthButtons()}</div>
      </div>
    </div>
  );
}
