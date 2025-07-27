import MobileTitle from "./mobileTitle";
import CategorySelect from "./CategorySelect";
import { CategoryOptions, MusicTag } from "../types/CategoryOptions";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/core/components/ui/button";
import CategoryTab from "./CategoryTab";
import CategoryCard from "./CategoryCard";
import { useNavigate } from "react-router-dom";
import { RawConertData } from "../types/RawConertData";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";

export default function CategorySection({ rawConcertList }: { rawConcertList: RawConertData[] }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [options, setOptions] = useState<CategoryOptions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOptions | null>(null);

  // 取得 Music Tag 列表
  const {
    data: musicTagsData,
    error,
    refetch,
  } = useRequest<MusicTag[]>({
    queryKey: ["music-tags"],
    url: "/api/v1/concerts/music-tags",
  }).useGet();

  // 根據演唱會資料計算每個分類的數量
  const categoryCountMap = useMemo(() => {
    if (!rawConcertList) return new Map();
    
    const countMap = new Map<string, number>();
    rawConcertList.forEach(concert => {
      const count = countMap.get(concert.musicTagName) || 0;
      countMap.set(concert.musicTagName, count + 1);
    });
    
    return countMap;
  }, [rawConcertList]);

  useEffect(() => {
    if (Array.isArray(musicTagsData)) {
      const covertOptions = musicTagsData
        .map((item: MusicTag) => {
          return {
            label: item.musicTagName,
            value: item.musicTagName,
            subLabel: item.subLabel,
          };
        })
        .filter(Boolean);
      
      setOptions(covertOptions);
      
      // 如果還沒有選擇分類，選擇第一個有演唱會的分類
      if (covertOptions.length > 0 && !selectedCategory) {
        // 找出有演唱會的分類
        const categoryWithConcerts = covertOptions.find(option => 
          categoryCountMap.get(option.value) && categoryCountMap.get(option.value)! > 0
        );
        
        // 如果有找到有演唱會的分類就選擇它，否則選擇第一個
        setSelectedCategory(categoryWithConcerts || covertOptions[0]);
      }
    }
  }, [musicTagsData, categoryCountMap]);

  // 處理錯誤
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "發生錯誤，請稍後再試",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const covertCardList = useMemo(() => {
    if (!rawConcertList) {
      return [];
    }

    const data = [...rawConcertList];

    const mappedData = data.map((item) => {
      return {
        type: item.musicTagName,
        title: item.conTitle,
        image: item.imgBanner,
        chips: [item.musicTagName, item.venueName],
        link: `/concert/${item.concertId}`,
      };
    });

    return mappedData;
  }, [rawConcertList]);

  const cardList = useMemo(() => {
    return covertCardList;
  }, [covertCardList]);

  const filteredCards = useMemo(() => {
    if (!selectedCategory || !cardList.length) return [];
    return cardList
      .filter((card) => {
        return card.type === selectedCategory.value;
      })
      .slice(0, 6);
  }, [selectedCategory, cardList]);

  return (
    <section className="mt-12 min-h-[80vh] lg:mt-20">
      <div className="mx-auto h-full lg:w-[96%]">
        <MobileTitle title="活動分類" subtitle="Event Categories" deskTopShow={true} />
        {/* 手機 select */}
        <div className="my-10 flex items-center justify-center lg:hidden">
          <CategorySelect options={options} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        {/* 電腦版 Tab */}
        <div className="mb-8 mt-4 hidden lg:block">
          <CategoryTab tabs={options} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
        {/* card content */}
        <div className="mx-4 mb-8 grid max-w-[1400px] grid-cols-2 gap-4 lg:mt-4 lg:grid-cols-3 xl:mx-auto">
          {filteredCards.length > 0 ? (
            filteredCards.map((card, index) => <CategoryCard key={`${card.type}-${card.title}-${index}`} {...card} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-lg text-gray-500">目前「{selectedCategory?.label}」分類沒有任何活動</p>
              {categoryCountMap.size > 0 && (
                <p className="mt-2 text-sm text-gray-400">
                  可以切換到其他分類查看更多活動
                </p>
              )}
            </div>
          )}
        </div>

        {/* 搜尋按鈕 */}
        <div className="flex items-center justify-center">
          <Button onClick={() => navigate("/concerts")} className="w-[90%] max-w-[800px] rounded-full text-lg" variant="outline">
            搜尋更多
          </Button>
        </div>
      </div>
    </section>
  );
}
