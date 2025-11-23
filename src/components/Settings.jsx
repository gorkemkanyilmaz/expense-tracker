import React, { useState, useEffect } from 'react';
import { CalendarService } from '../services/calendar';

const Settings = () => {
  const [notificationTime, setNotificationTime] = useState('09:00');

  useEffect(() => {
    const savedTime = localStorage.getItem('notificationTime') || '09:00';
    setNotificationTime(savedTime);
  }, []);

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
          <div className="setting-icon">📅</div>
          <div className="setting-info">
            <h3>Takvim Entegrasyonu</h3>
            <p>Giderleriniz iPhone takviminize eklensin</p>
          </div>
        </div>

        <div className="time-picker-container">
          <label>Anımsatıcı Saat Kaç'ta Hatırlatma Olarak eklensin:</label>
          <input
            type="time"
            value={notificationTime}
            onChange={handleTimeChange}
          />
        </div>
      </div>

      <div className="info-card">
        <h3>Nasıl Çalışır?</h3>
        <p>
          Gider eklediğinizde, seçtiğiniz saat için bir takvim dosyası (.ics) oluşturulur.
          Bu dosyayı açarak etkinliği iPhone takviminize ekleyebilirsiniz.
          <br /><br />
          <strong>iPhone'da:</strong>
          <br />
          • Dosya indirildiğinde Safari'nin alt kısmında görünecektir
          <br />
          • Dosyaya dokunun ve "Takvime Ekle" seçeneğini seçin
          <br />
          • Hatırlatma otomatik olarak takviminize eklenecektir
          <br /><br />
          Ödeme yaptığınızda veya gideri sildiğinizde, takvimden silinmesi için
          yeni bir iptal dosyası oluşturulur. Bu dosyayı da aynı şekilde açmanız gerekir.
        </p>
      </div>

      <div className="info-card warning">
        <h3>⚠️ Önemli Notlar</h3>
        <p>
          • <strong>Aynı takvimi seçin:</strong> Gider eklerken ve silerken iPhone'da
          <strong> aynı takvimi</strong> seçmelisiniz (örn: her ikisinde de "iCloud - Takvim").
          Farklı takvimler seçerseniz, silme işlemi çalışmaz.
          <br /><br />
          • Bu uygulama bir PWA (Progressive Web App) olduğu için, takvim dosyalarını
          otomatik olarak takvime ekleyemez. Her dosyayı manuel olarak açmanız gerekir.
          <br /><br />
          • Eğer dosya indirilmiyorsa, Safari ayarlarınızdan "İndirmeler" izninin
          açık olduğundan emin olun.
          <br /><br />
          • Uygulamayı Ana Ekrana ekleyerek kullanmanız önerilir (Safari'de Paylaş → Ana Ekrana Ekle).
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
        
        .time-picker-container {
          border-top: 1px solid var(--border-color);
          padding-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .time-picker-container label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        input[type="time"] {
          background-color: var(--bg-color);
          border: 1px solid var(--border-color);
          color: white;
          padding: 12px;
          border-radius: var(--radius-sm);
          width: 100%;
          font-size: 16px;
        }

        .info-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .info-card.warning {
          background-color: rgba(255, 149, 0, 0.1);
          border-left: 3px solid #ff9500;
        }
        .info-card.warning h3 {
          color: #ff9500;
        }
      `}</style>
    </div>
  );
};

export default Settings;
