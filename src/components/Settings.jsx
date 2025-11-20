import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [permissionStatus, setPermissionStatus] = useState('default');

  useEffect(() => {
    const savedEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    const savedTime = localStorage.getItem('notificationTime') || '09:00';
    setNotificationsEnabled(savedEnabled);
    setNotificationTime(savedTime);

    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Enabling
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          // Test notification
          new Notification('Bildirimler Açık', {
            body: 'Gider hatırlatmaları bu cihazda aktif edildi.',
            icon: '/pwa-192x192.png'
          });
        } else {
          alert('Bildirim izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.');
        }
      } else {
        alert('Tarayıcınız bildirimleri desteklemiyor.');
      }
    } else {
      // Disabling
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setNotificationTime(time);
    localStorage.setItem('notificationTime', time);
  };

  return (
    <div className="settings-view">
      <h2>Ayarlar</h2>

      <div className="setting-card">
        <div className="setting-header">
          <div className="setting-icon">🔔</div>
          <div className="setting-info">
            <h3>Bildirimler</h3>
            <p>Günlük ödeme hatırlatmaları al</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {notificationsEnabled && (
          <div className="time-picker-container">
            <label>Hatırlatma Saati:</label>
            <input
              type="time"
              value={notificationTime}
              onChange={handleTimeChange}
            />
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="warning-msg">
            ⚠️ Bildirim izni reddedildi. Ayarlardan açmanız gerekiyor.
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>Nasıl Çalışır?</h3>
        <p>
          iPhone'da bildirim alabilmek için:
          <br />1. Uygulamayı <strong>Ana Ekrana Ekle</strong>melisiniz.
          <br />2. Bildirimleri buradan açmalısınız.
          <br />3. Uygulama kapalıyken bile bildirim gelmesi için iOS kısıtlamaları nedeniyle bazen uygulamayı açmanız gerekebilir.
        </p>
      </div>

      <style>{`
        .settings-view {
          padding: 20px;
        }
        h2 {
          margin-bottom: 20px;
        }
        .setting-card, .info-card {
          background-color: var(--surface-color);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 20px;
        }
        .setting-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        .setting-icon {
          font-size: 24px;
          background-color: var(--surface-color-light);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .setting-info {
          flex: 1;
        }
        .setting-info h3 {
          font-size: 16px;
          margin-bottom: 4px;
        }
        .setting-info p {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--surface-color-light);
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: var(--primary-color);
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }

        .time-picker-container {
          border-top: 1px solid var(--border-color);
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        input[type="time"] {
          background-color: var(--bg-color);
          border: 1px solid var(--border-color);
          color: white;
          padding: 8px;
          border-radius: var(--radius-sm);
          width: auto;
        }

        .warning-msg {
          color: var(--danger-color);
          font-size: 12px;
          margin-top: 10px;
        }
        .info-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Settings;
