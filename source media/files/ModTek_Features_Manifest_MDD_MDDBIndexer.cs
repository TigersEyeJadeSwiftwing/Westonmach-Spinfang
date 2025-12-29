using BattleTech;
using BattleTech.Data;
using BattleTech.Framework;
using ModTek.Features.CustomEncounterLayers;
using ModTek.Features.CustomResources;
using Newtonsoft.Json.Linq;

namespace ModTek.Features.Manifest.MDD;

internal static class MDDBIndexer
{
    public static void InstantiateResourceAndUpdateMDDB(VersionManifestEntry entry, string json)
    {
        if (BTConstants.ICResourceType(entry.Type, out var cResourceType))
        {
            InstantiateResourceAndUpdateMDDB(cResourceType, entry.Id, json);
        }

        if (BTConstants.BTResourceType(entry.Type, out var btResourceType))
        {
            InstantiateResourceAndUpdateMDDB(btResourceType, entry.Id, json);
        }
    }

    private static void InstantiateResourceAndUpdateMDDB(InternalCustomResourceType type, string id, string json)
    {
        var mddb = MetadataDatabase.Instance;
        switch (type)
        {
            case InternalCustomResourceType.EncounterLayer:
            {
                var encounterLayer = EncounterLayer.FromJSON(json);
                mddb.UpdateEncounterLayer(encounterLayer);
                break;
            }
        }
    }

    // Copied from VersionManifestHotReload.InstantiateResourceAndUpdateMDDB
    // modified to work with proper ids
    private static void InstantiateResourceAndUpdateMDDB(BattleTechResourceType resourceType, string id, string json)
    {
        var mddb = MetadataDatabase.Instance;
        switch (resourceType)
        {
            case BattleTechResourceType.ContractOverride:
            {
                var contractOverride = new ContractOverride();
                contractOverride.FromJSON(json);
                contractOverride.FullRehydrate();
                mddb.UpdateContract(id, contractOverride);
                break;
            }
            case BattleTechResourceType.LanceDef:
            {
                var lanceDef = new LanceDef();
                lanceDef.FromJSON(json);
                mddb.UpdateLanceDef(lanceDef);
                break;
            }
            case BattleTechResourceType.PilotDef:
            {
                var pilotDef = new PilotDef();
                pilotDef.FromJSON(json);
                mddb.UpdatePilotDef(pilotDef);
                break;
            }
            case BattleTechResourceType.SimGameEventDef:
            {
                var simGameEventDef = new SimGameEventDef();
                simGameEventDef.FromJSON(json);
                mddb.UpdateEventDef(simGameEventDef);
                break;
            }
            case BattleTechResourceType.MechDef:
            {
                var mechDef = new MechDef();
                mechDef.FromJSON(json);
                mddb.UpdateUnitDef(mechDef);
                break;
            }
            case BattleTechResourceType.WeaponDef:
            {
                // Support both a single WeaponDef JSON object and an array of WeaponDef objects.
                // If json is an array, parse each element and call FromJSON on a new WeaponDef for each one.
                var trimmed = json?.TrimStart();
                if (!string.IsNullOrEmpty(trimmed) && trimmed.StartsWith("["))
                {
                    try
                    {
                        var jarray = JArray.Parse(json);
                        foreach (var item in jarray)
                        {
                            var weaponDef = new WeaponDef();
                            weaponDef.FromJSON(item.ToString());
                            mddb.UpdateWeaponDef(weaponDef);
                        }
                    }
                    catch (Exception)
                    {
                        // If parsing as an array fails for any reason, fall back to single-object behavior
                        var weaponDef = new WeaponDef();
                        weaponDef.FromJSON(json);
                        mddb.UpdateWeaponDef(weaponDef);
                    }
                }
                else
                {
                    var weaponDef = new WeaponDef();
                    weaponDef.FromJSON(json);
                    mddb.UpdateWeaponDef(weaponDef);
                }
                break;
            }
            case BattleTechResourceType.TurretDef:
            {
                var turretDef = new TurretDef();
                turretDef.FromJSON(json);
                mddb.UpdateUnitDef(turretDef);
                break;
            }
            case BattleTechResourceType.VehicleDef:
            {
                var vehicleDef = new VehicleDef();
                vehicleDef.FromJSON(json);
                mddb.UpdateUnitDef(vehicleDef);
                break;
            }
            case BattleTechResourceType.UpgradeDef:
            {
                var upgradeDef = new UpgradeDef();
                upgradeDef.FromJSON(json);
                mddb.UpdateUpgradeDef(upgradeDef);
                break;
            }
        }
    }
}