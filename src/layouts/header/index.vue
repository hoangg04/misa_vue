<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
})
const icons = [
  {
    title: 'Thông báo',
    badge: null,
    icon: 'icon-notification-version icon-base-24',
  },
  {
    title: 'Cửa hàng',
    badge: 4,
    icon: 'icon-store relative',
  },
  {
    title: 'Thêm người dùng',
    badge: null,
    icon: 'icon-user-plus icon-base-24',
  },
  {
    title: 'Tin nhắn',
    badge: null,
    icon: 'icon-messbox-icon-message-dark icon-base-24',
  },
  {
    title: 'Thông báo chọn',
    badge: null,
    icon: 'icon-noti-selector-box icon-base-24',
  },
  {
    title: 'Trung tâm trợ giúp',
    badge: null,
    icon: 'icon-helpmenu-trigger icon-base-24',
  },
  {
    title: 'Menu thêm',
    badge: null,
    icon: 'icon-moremenu-trigger icon-base-24',
  },
  {
    title: 'Knowledge',
    badge: null,
    icon: 'icon-knowledge-trigger icon-base-24',
  },
]
</script>

<template>
  <header class="header">
    <div class="header__right flex items-center gap-2 flex-1 mr-4 h-full">
      <div class="header__title flex items-center gap-2 flex-shrink-0 h-full">
        <div class="header__toggle-app icon-switch-app icon-base-24"></div>
        <div class="header__logo"></div>
        <div class="header__title-name">Tuyển dụng</div>
      </div>
      <div class="header__search">
        <span class="icon-default icon-search flex"></span>
        <input
          type="text"
          class="header__search-input"
          placeholder="Tìm kiếm tin tuyển dụng, ứng viên, nhân tài..."
        />
      </div>
    </div>
    <div class="header__actions flex items-center gap-2 mr-3">
      <div class="flex items-center gap-2 hover-text-primary">
        <div class="icon-default icon-global"></div>
        <span class="text-sm font-medium">Website tuyển dụng</span>
      </div>
      <div v-for="(item, index) in icons" :key="index" :class="`${item.icon}`" :title="item.title">
        <span v-if="item.badge" class="badge-icon">{{ item.badge }}</span>
      </div>
      <div class="header__user">
        <img
          src="https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&amp;width=64&amp;height=64"
        />
      </div>
    </div>
  </header>
</template>
<style scoped>
/* App Container */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

/* Header */
.header {
  height: 48px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  z-index: 100;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}
.header__right {
  height: 100%;
}
.header__title {
  background-image: url('https://amisplatform.misacdn.net/apps/recruit/navbar-bg-noel.ff04816e6511986f.svg');
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  padding-left: 16px;
  position: relative;
}
.header__title::after {
  background-image: url('https://amisplatform.misacdn.net/apps/recruit/event-header.8a0adb3bd0c107ff.svg');
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
  height: 100%;
  width: 100%;
  position: absolute;
  bottom: 0px;
  margin-left: -9px;
  display: block;
  content: '';
}
.header__title-name {
  min-width: fit-content;
  z-index: 2;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-right: 24px;
}
.header__logo {
  background-image: url('https://amisplatform.misacdn.net/apps/recruit/logo-recruitment-new.d56a0096f9a2229b.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  margin-left: 24px;
  margin-right: 10px;
}

.header__toggle-app {
  z-index: 2;
}
.header__search {
  flex: 1;
  border-radius: 4px;
  max-width: 365px;
  height: 32px;
  background-color: #f2f2f2;
  margin-right: 16px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.header__search-input {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: none;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
  max-width: 400px;
}

.header__search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.badge-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__user img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
</style>
