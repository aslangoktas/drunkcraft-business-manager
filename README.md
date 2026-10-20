# DrunkCraft Business Manager

DrunkCraft için günlük satış, gider, workshop, kasa ve finansal raporlama uygulaması. Arayüz Türkçedir; para birimi TRY, tarih yerel ayarı `tr-TR`, saat dilimi `Europe/Istanbul` olarak tasarlanmıştır.

## Özellikler

- Günlük satış kaydı ve kategori bazlı satış takibi
- Nakit, kart, banka ve karma tahsilat desteği
- Giderler, kısmi ödemeler, vade ve tekrarlayan gider kuralları
- Workshop kayıtları, katılımcı, maliyet ve tahsilat takibi
- Ürün/hizmet kataloğu ve isteğe bağlı stok alanları
- Nakit kasa, banka ve POS hesap bakiyeleri, hesaplar arası transfer
- Günlük, haftalık, aylık ve özel dönem raporları
- PDF raporları ve CSV dışa aktarma
- JSON yedekleme ve geri yükleme
- IndexedDB ile tarayıcıda kalıcı yerel kayıt
- Responsive Wabi-Sabi / zanaat temalı arayüz
- GitHub Pages için GitHub Actions iş akışı

## Gereksinimler

- Node.js 20 veya daha güncel LTS sürümü
- npm

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Vite terminalinde gösterilen yerel adresi tarayıcıda aç. İlk kullanımda **Örnek verilerle keşfet** veya **Boş işletme kaydı oluştur** seçeneklerinden birini seçebilirsin. Örnek veriler demo amacıyla üretilir; gerçek finansal kayıtları temsil etmez.

## Derleme ve test

```bash
npm run build
npm test
npm run preview
```

## GitHub Pages yayımlama

1. Bu klasörün tüm içeriğini yeni bir GitHub deposuna yükle.
2. Depo ayarlarında **Settings → Pages → Build and deployment → Source** bölümünde **GitHub Actions** seç.
3. `main` dalına yapılan her push, `.github/workflows/deploy.yml` dosyasındaki iş akışını tetikler.
4. İlk dağıtım bitince Pages bölümündeki yayımlanmış bağlantıyı aç.

Vite, GitHub Actions ortamında depo adını kullanarak göreli dağıtım yolunu yapılandırır. GitHub hesabına yükleme ve yayımlama bu proje klasöründen otomatik yapılmaz; yukarıdaki adımları kullanıcı olarak uygulaman gerekir.

## PDF ve CSV raporları

**Raporlar ve PDF** ekranından rapor türü, dönem, kategori ve fatura durumunu seç. Önizlemeyi kontrol ettikten sonra **PDF oluştur ve indir** veya **CSV olarak indir** seçeneklerini kullan.

PDF oluşturma pdfmake ile tarayıcı tarafında yapılır. Paket, kendi sanal dosya sistemi üzerinden Roboto yazı tipi tanımlarını kullanır. Çıktıların gerçek verilerle uyuştuğunu kontrol et; PDF raporları resmî muhasebe veya vergi beyannamesi yerine geçmez.

## Veriler ve güvenlik

- Kayıtlar IndexedDB içinde bu tarayıcıda saklanır.
- Bu sürüm verileri otomatik olarak başka cihazlarla senkronize etmez.
- Tarayıcı verilerinin temizlenmesi kayıtları silebilir; düzenli aralıklarla **Ayarlar ve Veriler → JSON tam yedeği** seçeneğini kullan.
- JSON yedeği satış, gider, ürün, workshop, hesap, transfer, kural ve ayarları içerir.
- Yedeği geri yüklemek mevcut kayıtları değiştirir. Geri yükleme onayını dikkatle oku.
- Hassas finansal kayıtlar otomatik olarak bir sunucuya gönderilmez.

## Finansal hesaplama notları

Net satış geliri, tahsilat, faaliyet sonucu ve kasa/banka bakiyesi farklı metriklerdir. Uygulama bunları ayrı göstermeye çalışır. Faaliyet sonucu, girilen ürün maliyetlerine ve gider kayıtlarına bağlı bir tahmindir; eksik maliyet bilgisi varsa kesin muhasebe kârı olarak değerlendirilmemelidir. KDV ve vergi raporlaması bilgilendirme amaçlıdır.

## Logo

`public/drunkcraft-logo.png`, kullanıcı tarafından sağlanan orijinal şeffaf PNG'dir. Logo dosyası yeniden çizilmemiş veya düzenlenmemiştir; uygulamada açık krem bir plaka üzerinde gösterilir.
