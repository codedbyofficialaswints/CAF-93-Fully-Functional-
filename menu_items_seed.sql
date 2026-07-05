-- 
-- CAFÉ 93° - PRODUCTS MIGRATION SEED DATA
-- Run this block directly inside your Supabase SQL Editor
-- This populates the products table with all 12 handcrafted items, maintaining category definitions, bilingual translations, OMR prices, stock flags, and visual photography.
--

-- Ensure we insert into the correct 'products' table schema
INSERT INTO products (id, name_en, name_ar, description_en, description_ar, price, category, image_url, in_stock)
VALUES
-- Hot Drinks
('m-1', 
 'Saffron Elixir Latte', 
 'لاتيه الزعفران الفاخر', 
 'Premium saffron-infused organic milk paired with single-origin espresso.', 
 'حليب عضوي منقوع بالزعفران الإيراني الفاخر مع إسبريسو أحادي المصدر.', 
 2.600, 
 'hot', 
 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600', 
 true),

('m-2', 
 'Cortado 93°', 
 'كورتادو ٩٣', 
 'Equal parts espresso and steamed micro-foam in a bespoke stoneware cup.', 
 'أجزاء متساوية من الإسبريسو والحليب المبخر الرغوي في كوب سيراميك مصنوع يدوياً.', 
 1.800, 
 'hot', 
 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600', 
 true),

('m-3', 
 'Spanish Sweet Latte', 
 'سبانش لاتيه دافئ', 
 'Smooth espresso paired with sweet condensed milk and organic steamed milk.', 
 'إسبريسو ناعم ممتزج مع حليب مكثف محلى وحليب مبخر عضوي.', 
 2.300, 
 'hot', 
 'https://images.unsplash.com/photo-1594911774802-8822a7079af1?auto=format&fit=crop&q=80&w=600', 
 true),

('m-4', 
 'V60 Ethiopian Single-Origin', 
 'قطارة V60 إثيوبيا أحادي المصدر', 
 'Slow pour-over highlighting exquisite notes of jasmine, bergamot, and sweet peach.', 
 'تقطير بطيء يبرز النوتات العطرية للياسمين والبرغموت والدراق الحلو.', 
 2.500, 
 'hot', 
 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600', 
 true),

-- Cold Drinks
('m-5', 
 'Cold Brew V60', 
 'كولد برو V60 مقطر بارداً', 
 '18-hour cold-dripped specialty coffee featuring bright fruity and cocoa notes.', 
 'تقطير بارد لمدة ١٨ ساعة يستخلص نوتات الفاكهة والكاكاو بطعم نقي ومنعش.', 
 2.700, 
 'cold', 
 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600', 
 true),

('m-6', 
 'Omani Rose Hibiscus Cold', 
 'مشروب الكركديه والورد العماني', 
 'Freshly brewed sour hibiscus infused with authentic Jebel Akhdar rose water.', 
 'كركديه طازج بارد منقوع بماء ورد الجبل الأخضر العماني الأصيل.', 
 2.200, 
 'cold', 
 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&q=80&w=600', 
 true),

('m-7', 
 'Iced Spanish Latte', 
 'سبانش لاتيه بارد', 
 'Double shot espresso poured over chilled sweet milk and handcrafted ice cubes.', 
 'إسبريسو مزدوج يسكب على حليب بارد محلى ومكعبات ثلج مصفاة يدوياً.', 
 2.400, 
 'cold', 
 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600', 
 true),

-- Desserts
('m-8', 
 'Lavender Romance Cake', 
 'كعكة لافندر ٩٣', 
 'Elegant layer cake infused with natural organic lavender floral notes and rich cream.', 
 'كيك بطبقات مخملية منقوعة بنكهة زهر اللافندر العضوي وحلاوة هادئة بقوام غني.', 
 2.800, 
 'desserts', 
 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600', 
 true),

('m-9', 
 'Luxury Snickers Cake', 
 'كيك السنيكرز الفاخر', 
 'Decadent sponge cake layered with homemade salted caramel, roasted peanuts, and milk chocolate.', 
 'كيك بطبقات من الكراميل المملح، الفول السوداني المقرمش، والشوكولاتة البلجيكية.', 
 2.900, 
 'desserts', 
 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600', 
 true),

('m-10', 
 'Saffron Rose Milk Cake', 
 'كعكة الحليب بالزعفران والورد', 
 'Classic sponge cake soaked in premium saffron-rose infused triple-milk sauce.', 
 'كيكة اسفنجية مشبعة بصلصة الحليب الثلاثي المنقوع بالزعفران الفاخر وماء الورد.', 
 3.100, 
 'desserts', 
 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600', 
 true),

-- Gifting
('m-11', 
 'Artisanal Coffee & Stoneware Box', 
 'صندوق الإهداء الفخاري والبن', 
 'A luxury rigid gift box containing 250g single-origin beans and 2 hand-thrown stoneware cups.', 
 'صندوق هدايا فاخر يحتوي على ٢٥٠ غرام بن أحادي المصدر وكوبين سيراميك مصنوعين يدوياً بشعار كافيه ٩٣.', 
 15.000, 
 'gifting', 
 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600', 
 true),

('m-12', 
 'The 93° Coffee Experience Box', 
 'صندوق تجربة المقطرات الكامل', 
 'Includes 3 select micro-lot bean bags and our custom gold-rimmed glass pour-over set.', 
 'يشمل ٣ محاصيل قهوة مختارة فاخرة مع طقم تقطير زجاجي ذو إطار ذهبي أنيق.', 
 24.000, 
 'gifting', 
 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', 
 true)
ON CONFLICT (id) 
DO UPDATE SET 
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  in_stock = EXCLUDED.in_stock;
