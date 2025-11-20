# iPhone'a Kurulum ve Bildirim Rehberi

Uygulamanızı iPhone'da kullanmak ve **uygulama içi bildirimleri** almak için aşağıdaki adımları izleyin.

## 1. Uygulamayı İnternete Yükleme (Vercel ile Ücretsiz)

Uygulamanızın telefonunuzda çalışması için güvenli bir internet adresine (HTTPS) ihtiyacı vardır.

1.  **GitHub Hesabı Oluşturun:** Eğer yoksa [github.com](https://github.com) adresinden ücretsiz bir hesap açın.
2.  **Projeyi GitHub'a Yükleyin:**
    *   Bilgisayarınızda proje klasöründe terminali açın.
    *   Sırasıyla şu komutları yazın:
        ```bash
        git init
        git add .
        git commit -m "İlk sürüm"
        ```
    *   GitHub'da "New Repository" diyerek yeni bir proje oluşturun.
    *   GitHub'ın size verdiği 3 satırlık kodu terminale yapıştırıp enter'a basın (remote add ve push komutları).
3.  **Vercel'e Üye Olun:** [vercel.com](https://vercel.com) adresine gidin ve "Continue with GitHub" diyerek giriş yapın.
4.  **Projeyi İçe Aktarın:**
    *   Vercel panelinde "Add New..." -> "Project" butonuna tıklayın.
    *   GitHub'daki projenizi listede göreceksiniz, "Import" butonuna basın.
    *   Hiçbir ayarı değiştirmeden "Deploy" butonuna basın.
5.  **Linkinizi Alın:** Kurulum bitince Vercel size `https://expense-tracker-xyz.vercel.app` gibi bir link verecek. Bu linki kopyalayın.

## 2. iPhone'a Yükleme (Ana Ekrana Ekleme - ZORUNLU)

iPhone'da bildirimlerin çalışması için uygulamanın **Ana Ekrana Eklenmesi** şarttır.

1.  iPhone'unuzdan Safari'yi açın.
2.  Vercel'den aldığınız linke gidin.
3.  Alt menüdeki **Paylaş** (kare içinde yukarı ok) butonuna basın.
4.  Menüyü aşağı kaydırın ve **"Ana Ekrana Ekle"** seçeneğine dokunun.
5.  İsim verip (Örn: Gider Takip) "Ekle" deyin.
6.  Uygulama artık ana ekranınızda bir ikon olarak belirecektir.

## 3. Bildirimleri Açma

1.  Ana ekrana eklediğiniz uygulamayı açın.
2.  Sağ üstteki **Ayarlar (Çark)** ikonuna tıklayın.
3.  **"Bildirimler"** anahtarını açın.
4.  iPhone sizden izin isteyecektir, **"İzin Ver"** deyin.
5.  Hatırlatma saatinizi seçin (Örn: 09:00).

**Önemli Not:**
Apple'ın kısıtlamaları nedeniyle, uygulama tamamen kapalıyken (arka planda bile değilken) bildirimler bazen gecikebilir veya gelmeyebilir. En iyi sonuç için uygulamayı ara sıra açmanız önerilir. Ancak uygulama "Ana Ekrana Ekle" yöntemiyle yüklendiğinde iOS ona daha fazla ayrıcalık tanır.

Güle güle kullanın! 🚀
