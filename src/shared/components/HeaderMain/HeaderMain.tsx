'use client';
import dynamic from 'next/dynamic';

import HeaderLayout from '@/shared/components/HeaderMain/HeaderLayout';
import useHeaderModal from '@/shared/hooks/HeaderMain/useHeaderModal';
import useHeaderAuth from '@/shared/hooks/HeaderMain/useHeaderAuth';

const AuthModal = dynamic(() => import('@/features/auth/components/AuthModal'), {
  ssr: false,
});

export default function HeaderMain() {
  const { modalType, setModalType, handleOpenModal } = useHeaderModal();
  const { isLogin, profile, handleLogout } = useHeaderAuth();

  return (
    <>
      <HeaderLayout handleOpenModal={handleOpenModal} handleLogout={handleLogout} profile={profile} isLogin={isLogin} />
      {/* 모달 */}
      {modalType && (
        <AuthModal
          onClose={() => {
            setModalType(null);
            document.body.style.overflow = 'auto';
          }}
          onChangeModal={(type) => setModalType(type)}
          type={modalType}
        />
      )}
    </>
  );
}
